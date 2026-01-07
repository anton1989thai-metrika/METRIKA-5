// This file can be used to set up automatic email syncing
// You can use it with a cron job or a scheduled task

import { syncAllEmails } from './imap-sync'

export async function scheduledEmailSync() {
  console.log('Starting scheduled email sync...')
  
  try {
    const results = await syncAllEmails()
    const totalSynced = results.reduce((sum, r) => sum + r.count, 0)
    
    console.log(`Email sync completed. Synced ${totalSynced} emails.`)
    console.log('Results:', results)
    
    return { success: true, totalSynced, results }
  } catch (error: any) {
    console.error('Scheduled email sync failed:', error)
    return { success: false, error: error.message }
  }
}

// For use with node-cron or similar
// import cron from 'node-cron'
// cron.schedule('*/5 * * * *', scheduledEmailSync) // Every 5 minutes

