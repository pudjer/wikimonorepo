import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { Driver } from "neo4j-driver";
import { NEO4J_DRIVER_TOKEN, NEO4J_DATABASE_TOKEN } from "../tokens";

@Injectable()
export class Neo4jSchema implements OnModuleInit {
  constructor(
    @Inject(NEO4J_DRIVER_TOKEN) private readonly driver: Driver,
    @Inject(NEO4J_DATABASE_TOKEN) private readonly database: string,
  ) {}

  async onModuleInit() {
    const session = this.driver.session({ database: this.database });

    try {
      await session.run(`
        CREATE CONSTRAINT user_id_unique IF NOT EXISTS
        FOR (u:User)
        REQUIRE u.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT user_username_unique IF NOT EXISTS
        FOR (u:User)
        REQUIRE u.username IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT session_id_unique IF NOT EXISTS
        FOR (s:Session)
        REQUIRE s.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT article_id_unique IF NOT EXISTS
        FOR (a:Article)
        REQUIRE a.id IS UNIQUE
      `);

    } finally {
      await session.close();
    }
  }
}