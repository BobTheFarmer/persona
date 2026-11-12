import { db } from './db';
import { items, events } from '@shared/schema';
import { campusClubs, scheduledCampusEvents } from './campus-catalog';
import { sql } from 'drizzle-orm';
let lastSync=0;
let pending:Promise<void>|undefined;
// Upserts stable IDs. Never delete accounts, historical records or RSVP choices.
export async function syncCampusCatalog() {
 if(Date.now()-lastSync<3600000) return;
 if(pending) return pending;
 pending=db.transaction(async tx=>{
  await tx.execute(sql`SELECT pg_advisory_xact_lock(72510932)`);
  for(const item of campusClubs) await tx.insert(items).values(item).onConflictDoUpdate({target:items.id,set:item});
  for(const event of scheduledCampusEvents()) await tx.insert(events).values(event).onConflictDoUpdate({target:events.id,set:event});
 }).then(()=>{lastSync=Date.now()}).finally(()=>{pending=undefined});
 return pending;
}
