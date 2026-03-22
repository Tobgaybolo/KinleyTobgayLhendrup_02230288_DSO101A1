const { Pool } = require("pg");

const isRender = Boolean(process.env.RENDER);
const isProduction = process.env.NODE_ENV === "production" || isRender;
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const hasDbHostConfig = Boolean(process.env.DB_HOST);

if (isProduction && !hasDatabaseUrl && !hasDbHostConfig) {
  throw new Error(
    "Missing DB config in production. Set DATABASE_URL (recommended) or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME."
  );
}

const shouldUseSsl = process.env.DB_SSL === "true" || isRender;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    });

async function initDb() {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await pool.query(query);
}

module.exports = {
  pool,
  initDb
};
