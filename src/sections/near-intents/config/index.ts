
export interface SDKConfig {
  logger?: any
  env?: NearIntentsEnv | EnvConfig
}

export interface EnvConfig {
  contractID: string
  poaBridgeBaseURL: string
  solverRelayBaseURL: string
  managerConsoleBaseURL: string
}

export type NearIntentsEnv = "production" | "stage"

const configsByEnvironment: Record<NearIntentsEnv, EnvConfig> = {
  production: {
    contractID: "intents.near",
    poaBridgeBaseURL: "https://bridge.chaindefuser.com",
    solverRelayBaseURL: "https://solver-relay-v2.chaindefuser.com",
    managerConsoleBaseURL: "https://api-mng-console.chaindefuser.com/api",
  },
  stage: {
    contractID: "staging-intents.near",
    // todo: update URLs when available
    poaBridgeBaseURL: "https://bridge.chaindefuser.com",
    solverRelayBaseURL: "https://solver-relay-v2.chaindefuser.com",
    managerConsoleBaseURL: "https://api-mng-console.chaindefuser.com/api",
  },
}

export let config = {
  env: configsByEnvironment.production,
}

export function configureSDK({ logger, env }: SDKConfig): void {
  if (typeof env === "string") {
    config = { ...config, env: configsByEnvironment[env] }
  } else if (env) {
    config = { ...config, env }
  }
}
