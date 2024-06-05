import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
    user: 'pub_sub_user',
    host: 'localhost',
    database: 'pub_sub',
    password: 'admin',
    port: 5432,
});

export default pool;