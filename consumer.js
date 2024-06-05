import pool from "./db.js";

const fetchAndProcessJobs = async () => {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT * FROM job_queue WHERE status = $1 FOR UPDATE SKIP LOCKED',
            ['pending']
        );

        const jobs = res.rows;

        for (const job of jobs) {
            try {
                await client.query('BEGIN');
                console.log('Processing job:', job);
                await client.query(
                    'UPDATE job_queue SET status = $1, updated_at = NOW() WHERE id = $2',
                    ['processed', job.id]
                );
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error processing job:', error);
            }
        }
    } finally {
        client.release();
    }
}

export default fetchAndProcessJobs;