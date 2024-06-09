import pool from "./db.js";

export const sleep = async () => {
    setTimeout(() => {
        Promise.resolve();
    }, 1000)
}

const fetchAndProcessJobs = async () => {
    const client = await pool.connect();
    const processId = process.pid;
    try {
        const res = await client.query(
            'SELECT * FROM job_queue WHERE status = $1 FOR UPDATE SKIP LOCKED',
            ['pending']
        );

        const jobs = res.rows;

        for (const job of jobs) {
            try {
                await client.query('BEGIN');
                console.log(`Processing (pid: ${processId}) job:`, job);
                await sleep();
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

(async () => {
    try {
        while (true) {
            await fetchAndProcessJobs();
        }
    } catch (err) {
        console.log(err);
    }
})()

