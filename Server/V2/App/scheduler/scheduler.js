import Bull from 'bull';
import { CronJob } from 'cron';
import FileContentManager from '../manager/FileContentManager';


// Initialize your queue
export const contentQueue = new Bull('contentQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});


// Periodic task setup using cron jobs
export const setupPeriodicTasks = () => {
    
    // Archive less accessed every 2 hours
    new CronJob('0 */2 * * *', async () => {
      await FileContentManager.archiveLessAccessed();
    }).start();
  
    // // Archive unreferenced every 3 hours
    // new CronJob('0 */3 * * *', async () => {
    //   await FileContentManager.removeUnreferenced();
    // }).start();
  
    // Cleanup expired archive every day at midnight
    new CronJob('0 0 * * *', async () => {
      await FileContentManager.cleanupExpiredArchive();
    }).start();
  };
  
  // Add tasks to the queue (if needed)
  export const addTaskToQueue = async (taskName, taskData) => {
    await contentQueue.add(taskName, taskData);
    console.log(`Task ${taskName} added to queue`);
  };
  


