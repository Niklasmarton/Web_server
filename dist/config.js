process.loadEnvFile(".env");
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
function envOrThrow(key) {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Missing environment value: ${key}`);
    }
    return val;
}
export let config = {
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
