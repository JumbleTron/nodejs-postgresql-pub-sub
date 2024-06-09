import pkg from 'pg';
import PgBoss from "pg-boss";

const { Pool } = pkg;
const pool = new Pool({
    user: 'pub_sub_user',
    host: 'localhost',
    database: 'pub_sub',
    password: 'admin',
    port: 5432,
});

export default pool;

const connectionString = 'postgres://pub_sub_user:admin@localhost:5432/pub_sub';
export const pgBoss = new PgBoss(connectionString);