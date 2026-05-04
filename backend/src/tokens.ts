//repositories
export const USER_REPOSITORY_TOKEN = Symbol()
export const ARTICLE_REPOSITORY_TOKEN = Symbol()
export const SESSION_REPOSITORY_TOKEN = Symbol()
export const ARTICLE_SEARCH_REPOSITORY_TOKEN = Symbol()
export const ARTICLE_PREVIEW_REPOSITORY_TOKEN = Symbol()
export const LEARN_PROGRESS_REPOSITORY_TOKEN = Symbol()
export const LIKE_REPOSITORY_TOKEN = Symbol()
export const VIEW_REPOSITORY_TOKEN = Symbol()
export const TOTAL_INTERACTION_REPOSITORY_TOKEN = Symbol()
export const ARTICLE_DAG_REPOSITORY_TOKEN = Symbol()
//props factories
export const USER_ID_FACTORY_TOKEN = Symbol()
export const ARTICLE_ID_FACTORY_TOKEN = Symbol()
export const SESSION_ID_FACTORY_TOKEN = Symbol()

//validators
export const USER_ID_VALIDATOR_TOKEN = Symbol()
export const ARTICLE_ID_VALIDATOR_TOKEN = Symbol()
export const SESSION_ID_VALIDATOR_TOKEN = Symbol()
export const USERNAME_VALIDATOR_TOKEN = Symbol()
export const PASSWORD_VALIDATOR_TOKEN = Symbol()
export const TITLE_VALIDATOR_TOKEN = Symbol()
export const CONTENT_VALIDATOR_TOKEN = Symbol()
export const ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR = Symbol()
export const ARTICLE_REFERENCES_VALIDATOR = Symbol()
export const QUERY_VALIDATOR_TOKEN = Symbol()

//other
export const HASHER_TOKEN = Symbol()
export const DOMAIN_EVENT_DISPATCHER_TOKEN = Symbol()

//entity factories
export const ARTICLE_FACTORY_TOKEN = Symbol()
export const SESSION_FACTORY_TOKEN = Symbol()
export const USER_FACTORY_TOKEN = Symbol()

//services
export const ARTICLE_SEARCH_SERVICE_TOKEN = Symbol()
export const ARTICLE_SEARCH_INDEX_SERVICE_TOKEN = Symbol()
export const SESSION_SERVICE_TOKEN = Symbol()
export const SESSION_SERVICE_LOGIN_TOKEN = Symbol()
export const SESSION_SERVICE_ADMIN_TOKEN = Symbol()
export const USER_SERVICE_PUBLIC_TOKEN = Symbol()
export const USER_SERVICE_PRIVATE_TOKEN = Symbol()
export const USER_SERVICE_ADMIN_TOKEN = Symbol()
export const ARTICLE_SERVICE_PUBLIC_TOKEN = Symbol()
export const ARTICLE_SERVICE_PRIVATE_TOKEN = Symbol()
export const ARTICLE_SERVICE_ADMIN_TOKEN = Symbol()
export const ARTICLE_PREVIEW_SERVICE_TOKEN = Symbol()
export const ARTICLE_DAG_SERVICE_TOKEN = Symbol()

// interactionUserArticle services
export const LEARN_PROGRESS_SERVICE_TOKEN = Symbol()
export const LIKE_SERVICE_TOKEN = Symbol()
export const VIEW_SERVICE_TOKEN = Symbol()
export const TOTAL_INTERACTION_SERVICE_TOKEN = Symbol()

//use-cases
export const LOGIN_USE_CASE_TOKEN = Symbol()

//infrastructure
export const NEO4J_DRIVER_TOKEN = Symbol()
export const NEO4J_TRANSACTION_TOKEN = Symbol()
export const SEARCH_ELASTICSEARCH_CLIENT_TOKEN = Symbol()

//env
export const PORT_TOKEN = Symbol()

export const NEO4J_URI_TOKEN = Symbol()
export const NEO4J_USER_TOKEN = Symbol()
export const NEO4J_PASSWORD_TOKEN = Symbol()
export const NEO4J_DATABASE_TOKEN = Symbol()

export const ELASTICSEARCH_NODES_TOKEN = Symbol()
export const ELASTICSEARCH_USERNAME_TOKEN = Symbol()
export const ELASTICSEARCH_PASSWORD_TOKEN = Symbol()

export const SESSION_ACTIVE_TIME_MS_TOKEN = Symbol()

