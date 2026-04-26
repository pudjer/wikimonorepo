import { Global, Module, Scope } from '@nestjs/common';
import { Driver, Transaction } from 'neo4j-driver';
import { NEO4J_DRIVER_TOKEN, NEO4J_URI_TOKEN, NEO4J_USER_TOKEN, NEO4J_PASSWORD_TOKEN, NEO4J_DATABASE_TOKEN, NEO4J_TRANSACTION_TOKEN, SEARCH_ELASTICSEARCH_CLIENT_TOKEN, ELASTICSEARCH_NODES_TOKEN, ELASTICSEARCH_USERNAME_TOKEN, ELASTICSEARCH_PASSWORD_TOKEN } from '../tokens';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Neo4jTransactionInterceptor } from './finalizationInterceptor';
import { Neo4jSchema } from './neo4jScheme';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionServiceInfra } from './tasks/sessionServiceInfra';
import { ArticleStatisticServiceInfra } from './tasks/statistcsServiceInfra';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    {
      provide: NEO4J_DRIVER_TOKEN,
      useFactory: async (uri: string, user: string, password: string): Promise<Driver> => {
        const neo4j = await import('neo4j-driver');
        const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

        try {
          await driver.getServerInfo();
        } catch (e) {
          await driver.close();
          throw new Error(`Neo4j connection failed`);
        }
    
        return driver;
      },
      inject: [NEO4J_URI_TOKEN, NEO4J_USER_TOKEN, NEO4J_PASSWORD_TOKEN],
    },
    Neo4jSchema,
    SessionServiceInfra,
    ArticleStatisticServiceInfra,
    {
      provide: NEO4J_TRANSACTION_TOKEN,
      scope: Scope.REQUEST, // важно: транзакция на запрос
      useFactory: async (driver: Driver, database: string): Promise<Transaction> => {
        const session = driver.session({ database });
        const tx = session.beginTransaction();

        // важно: повесить lifecycle
        const originalCommit = tx.commit.bind(tx);
        const originalRollback = tx.rollback.bind(tx);

        tx.commit = async () => {
          try {
            await originalCommit();
          } finally {
            await session.close();
          }
        };

        tx.rollback = async () => {
          try {
            await originalRollback();
          } finally {
            await session.close();
          }
        };

        return tx;
      },
      inject: [NEO4J_DRIVER_TOKEN, NEO4J_DATABASE_TOKEN],
    },
    {
      provide: SEARCH_ELASTICSEARCH_CLIENT_TOKEN,
      useFactory: async (nodes: string, username: string, password: string) => {
        const { Client } = await import('@elastic/elasticsearch');
        const client = new Client({
          node: nodes,
          auth: {
            username,
            password
          }
        });
        try {
          await client.info();
        } catch (e) {
          throw new Error(`Elasticsearch connection failed: ${e}`);
        }
        return client;
      },
      inject: [ELASTICSEARCH_NODES_TOKEN, ELASTICSEARCH_USERNAME_TOKEN, ELASTICSEARCH_PASSWORD_TOKEN],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: Neo4jTransactionInterceptor,
      scope: Scope.REQUEST
    },
  ],
  exports: [NEO4J_TRANSACTION_TOKEN, SEARCH_ELASTICSEARCH_CLIENT_TOKEN],
})
export class InfrastructureModule {}

