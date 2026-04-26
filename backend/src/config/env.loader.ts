import { DurationMs } from '../domain/session/entity'
import { EnvConfig } from './env.types'

export function loadEnv(): EnvConfig {
  return {
    port: Number(process.env.PORT),

    neo4j: {
      uri: process.env.NEO4J_URI!,
      user: process.env.NEO4J_USER!,
      password: process.env.NEO4J_PASSWORD!,
      database: process.env.NEO4J_DATABASE!,
    },

    elasticsearch: {
      nodes: process.env.ELASTICSEARCH_NODES!.split(','),
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },

    session: {
      activeTimeMs: new DurationMs(Number(process.env.SESSION_ACTIVE_TIME_MS)),
    },
  }
}