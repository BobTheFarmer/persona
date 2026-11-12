import test from 'node:test';
import assert from 'node:assert/strict';
import { occurrences,localDateTimeToUtc } from './recurrence';
const base={start:'2026-09-03',until:'2026-11-19',weekdays:[4],time:'19:30',timeZone:'America/Chicago'};
test('Chicago wall time observes DST',()=>{
 assert.equal(localDateTimeToUtc('2026-10-29','19:30','America/Chicago').toISOString(),'2026-10-30T00:30:00.000Z');
 assert.equal(localDateTimeToUtc('2026-11-12','19:30','America/Chicago').toISOString(),'2026-11-13T01:30:00.000Z');
});
test('only future events within verified window; no Thanksgiving or forever roll-forward',()=>{
 const list=occurrences(base,new Date('2026-11-12T00:00:00Z'));
 assert.deepEqual(list.map(x=>x.localDate),['2026-11-12','2026-11-19']);
 assert.equal(occurrences(base,new Date('2026-11-20T12:00:00Z')).length,0);
});
test('supports interval and exclusions, stable across restarts',()=>{
 const rule={...base,intervalWeeks:2,excludedDates:['2026-11-12']};
 const now=new Date('2026-10-01T00:00:00Z');
 const a=occurrences(rule,now); assert.ok(!a.some(x=>x.localDate==='2026-11-12'));
 assert.deepEqual(a,occurrences(rule,now));
});
test('reject unbounded rules',()=>assert.throws(()=>occurrences({...base,until:'2030-01-01'},new Date())));
