import test from 'node:test';
import assert from 'node:assert/strict';
import {campusClubs,scheduledCampusEvents,eventSource} from './campus-catalog';
test('catalog uses real official sources and no manufactured club deadlines or popularity',()=>{
 assert.equal(campusClubs.length,19);
 assert.equal(new Set(campusClubs.map(c=>c.id)).size,19);
 for(const c of campusClubs){assert.ok(c.signupUrl?.startsWith('https://getinvolved.tamu.edu/org/'));assert.equal(c.popularity,0);assert.equal(c.nextMeetingAt,null);assert.equal(c.dues,null);}
});
test('nine future published occurrences, distinct stable IDs and linked sources',()=>{
 const list=scheduledCampusEvents(new Date('2026-11-12T00:00:00Z'));
 assert.equal(list.length,9);assert.equal(new Set(list.map(e=>e.id)).size,9);
 for(const e of list){assert.ok(eventSource(e.id).sourceUrl);assert.equal(e.attendeeCount,0);assert.ok(e.locationLat);}
 assert.equal(scheduledCampusEvents(new Date('2026-12-02T12:00:00Z')).length,0);
});
test('expired events never move forward on restarts',()=>{
 const later=scheduledCampusEvents(new Date('2026-11-20T12:00:00Z'));
 assert.equal(later.length,1);assert.equal(later[0].location,'Commons 109');
});
