import { DurationMs } from "../domain/session/entity"

export interface EnvConfig {
    port: number
  
    neo4j: {
      uri: string
      user: string
      password: string
      database: string
    }
  
    elasticsearch: {
      nodes: string[]
      username: string
      password: string
    }
  
    session: {
      activeTimeMs: DurationMs
    }
  }