import { Inject, Injectable } from "@nestjs/common";
import { ArticleStatisticRepository } from "../../domain/articleStatistic/repository";
import { ARTICLE_STATISTIC_REPOSITORY_TOKEN, NEO4J_DATABASE_TOKEN, NEO4J_DRIVER_TOKEN } from "../../tokens";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Driver, Transaction } from "neo4j-driver";


@Injectable()
export class ArticleStatisticServiceInfra {
    constructor(
        @Inject(NEO4J_DRIVER_TOKEN) private readonly driver: Driver,
        @Inject(NEO4J_DATABASE_TOKEN) private readonly database: string,
    ){}
    private async aggregateInteractions(tx: Transaction): Promise<true> {
        const query = `
          MATCH (a:Article)
    
          OPTIONAL MATCH (a)<-[:VIEWS]-(v:User)
          WITH a, count(v) AS views
    
          OPTIONAL MATCH (a)<-[:LIKES]-(l:User)
          WITH a, views, count(l) AS likes
    
          OPTIONAL MATCH (a)<-[lp:LEARNS_PROGRESS]-(u:User)
          WITH 
            a, 
            views, 
            likes,
            count(CASE WHEN lp.learnProgressStage = "learning" THEN 1 END) AS learners,
            count(CASE WHEN lp.learnProgressStage = "mastered" THEN 1 END) AS masters
    
          SET 
            a.views = views,
            a.likes = likes,
            a.learners = learners,
            a.masters = masters,
            a.selfPoints = 2 * masters + learners
        `;
    
        await tx.run(query);
        return true;
      }
      private async setDepth(tx: Transaction): Promise<true> {
        const query = `
          MATCH (n:Article)
          WITH n
          MATCH p = (:Article)-[:EXTENDS*0..]->(n)
          WITH n, max(length(p)) AS depth
          SET n.depth = depth
        `;
        await tx.run(query);
        return true;
      }


      @Cron(CronExpression.EVERY_30_SECONDS)
      async updateEntireStatistics(): Promise<true> {
        const session = this.driver.session({ database: this.database });
        const tx = session.beginTransaction();
        try{
            await this.aggregateInteractions(tx);
            await this.setDepth(tx);
            const query = `
            MATCH (a:Article)
            WITH a
            ORDER BY a.depth ASC
            CALL (a) {
                OPTIONAL MATCH (a)<-[:EXTENDS]-(c:Article)
                WITH a, sum(coalesce(c.dagPoints, 0)) AS childrenSum
                SET a.dagPoints = coalesce(a.selfPoints, 0) + childrenSum
            }
            `;
            await tx.run(query);
            await tx.commit();
            return true;
        }catch(e){
            await tx.rollback();
            throw e;
        }
        finally{
            await session.close();
        }
      }
}