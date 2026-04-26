import { Injectable, Inject } from "@nestjs/common"
import { DurationMs, SessionFactory } from "../../domain/session/entity"
import { SessionRepository } from "../../domain/session/repository"
import { NEO4J_DATABASE_TOKEN, NEO4J_DRIVER_TOKEN, SESSION_ACTIVE_TIME_MS_TOKEN, SESSION_FACTORY_TOKEN, SESSION_REPOSITORY_TOKEN } from "../../tokens"
import { Cron, CronExpression } from "@nestjs/schedule"
import { Driver } from "neo4j-driver"


@Injectable()
export class SessionServiceInfra{
    
    constructor(
        @Inject(NEO4J_DRIVER_TOKEN) private readonly driver: Driver,
        @Inject(NEO4J_DATABASE_TOKEN) private readonly database: string,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async deleteExpiredSessions(): Promise<true> {
        const session = this.driver.session({ database: this.database });
        const tx = session.beginTransaction();
        try{
            const nowMs = Date.now();
            await tx.run(
              `MATCH (s:Session)
               WHERE s.timestamp + s.durationMs < $nowMs
               DETACH DELETE s`,
              { nowMs }
            );
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