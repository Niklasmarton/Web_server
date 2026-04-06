import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile(".env")


const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url: string
    migrationConfig: MigrationConfig
}

function envOrThrow(key: string): string {
    const val = process.env[key]
    if (!val) {
        throw new Error(`Missing environment value: ${key}`)
    }
    return val
}

type APIConfig = {
    fileServerHits: number
    platform: string
    jwtSecret: string
    polkakey: string
}

type Config = {
    api: APIConfig
    db: DBConfig
}

export let config: Config = {
    api: {
        fileServerHits: 0,
        platform: envOrThrow("PLATFORM"),
        jwtSecret: envOrThrow("JWT_SECRET"),
        polkakey: envOrThrow("POLKA_KEY")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    }
};