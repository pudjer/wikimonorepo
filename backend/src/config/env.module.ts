// env.module.ts
import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env.schema'
import { loadEnv } from './env.loader'
import { EnvConfig } from './env.types'

import {
  PORT_TOKEN,

  NEO4J_URI_TOKEN,
  NEO4J_USER_TOKEN,
  NEO4J_PASSWORD_TOKEN,
  NEO4J_DATABASE_TOKEN,

  ELASTICSEARCH_NODES_TOKEN,
  ELASTICSEARCH_USERNAME_TOKEN,
  ELASTICSEARCH_PASSWORD_TOKEN,

  SESSION_ACTIVE_TIME_MS_TOKEN,
  
} from './../tokens'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
  ],
  providers: [
    {
      provide: 'ENV_CONFIG',
      useFactory: (): EnvConfig => loadEnv(),
    },

    {
      provide: PORT_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.port,
    },

    {
      provide: NEO4J_URI_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.neo4j.uri,
    },
    {
      provide: NEO4J_USER_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.neo4j.user,
    },
    {
      provide: NEO4J_PASSWORD_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.neo4j.password,
    },
    {
      provide: NEO4J_DATABASE_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.neo4j.database,
    },

    {
      provide: ELASTICSEARCH_NODES_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.elasticsearch.nodes,
    },
    {
      provide: ELASTICSEARCH_USERNAME_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.elasticsearch.username,
    },
    {
      provide: ELASTICSEARCH_PASSWORD_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.elasticsearch.password,
    },

    {
      provide: SESSION_ACTIVE_TIME_MS_TOKEN,
      inject: ['ENV_CONFIG'],
      useFactory: (env: EnvConfig) => env.session.activeTimeMs,
    },
  ],
  exports: [
    PORT_TOKEN,

    NEO4J_URI_TOKEN,
    NEO4J_USER_TOKEN,
    NEO4J_PASSWORD_TOKEN,
    NEO4J_DATABASE_TOKEN,

    ELASTICSEARCH_NODES_TOKEN,
    ELASTICSEARCH_USERNAME_TOKEN,
    ELASTICSEARCH_PASSWORD_TOKEN,

    SESSION_ACTIVE_TIME_MS_TOKEN,
  ],
})
export class EnvModule {}