import { pgBoss } from "./db.js";

const boss = pgBoss

async function startConsumer() {
  try {
    await boss.start();
    await boss.work('example-queue', async job => {
      console.log(`Received job: ${job.id} with data:`, job.data);
      return 'done';
    });
    
    console.log('Consumer started and listening for jobs...');
  } catch (err) {
    console.error('Error starting consumer:', err);
  }
}

(async () => {
  try {
    await startConsumer();
  } catch (err) {
    console.log(err)
  }
})()
