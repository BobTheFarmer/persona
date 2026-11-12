import clubs from './data/tamu-clubs.json';
import type { InsertItem, InsertEvent } from '@shared/schema';
import rhaOccurrences from './data/tamu-events.json';
import { localDateTimeToUtc, occurrences, type Recurrence } from './recurrence';
export const CATALOG_CHECKED_AT = '2026-11-12';
export const clubIds = clubs.map(c=>`tamu-${c.slug}`);
// Trait values are Persona's editorial interest heuristics, not claims from TAMU.
export const campusClubs: (InsertItem & {id:string})[] = clubs.map(c=>({
 id:`tamu-${c.slug}`, title:c.title, domain:c.domain, description:c.description,
 signupUrl:c.url, tags:c.tags, popularity:0,
 imageUrl:c.slug==='aggiecodingclub'?'/club-coding':c.domain==='sports'?'/club-soccer':c.domain==='volunteering'?'/club-service':c.domain==='academic'?'/club-research':'/club-social',
 traitStrategy:c.domain==='academic'||c.domain==='professional'?0.8:0.5,
 traitSocial:c.domain==='social'||c.domain==='volunteering'?0.8:0.5,
 traitIntensity:c.domain==='sports'?0.8:0.5,
 traitAdventure:c.tags.includes('outdoors')?0.85:0.5,
 traitCreativity:c.tags.some(t=>['creative','dance','performance','coding'].includes(t))?0.8:0.5,
 nextMeetingAt:null,meetingLocation:null,meetingDay:null,meetingTime:null,
 instagramUrl:null,dues:null,duesDeadline:null,locationLat:null,locationLng:null,
}));
interface Series {
 id:string; title:string; description:string; clubSlug:string; location:string;
 sourceUrl:string; rule:Recurrence; category:string; durationMinutes:number;
 lat?:number; lng?:number; free?:boolean;
}
const chicago='America/Chicago';
// Only official posted windows; no extrapolation into a new term or holidays.
export const eventSeries:Series[]=[
 {id:'swap-store-fall26',title:'Swap Store',description:'Browse free clothing or bring items to donate or swap.',clubSlug:'aggieecoreps',location:'Hullabaloo Hall 114',lat:30.61646,lng:-96.346322,sourceUrl:'https://getinvolved.tamu.edu/org/aggieecoreps/events/26638/518763',category:'campus',durationMinutes:180,free:true,rule:{start:'2026-09-08',until:'2026-11-19',weekdays:[2,4],time:'16:30',timeZone:chicago}},
 {id:'eco-reps-fall26',title:'Aggie Eco-Rep General Meeting',description:'Campus sustainability projects, volunteering and student-led initiatives.',clubSlug:'aggieecoreps',location:'Hullabaloo Hall 117A',lat:30.61646,lng:-96.346322,sourceUrl:'https://getinvolved.tamu.edu/org/aggieecoreps/events/27222/510900',category:'campus',durationMinutes:60,rule:{start:'2026-09-03',until:'2026-11-19',weekdays:[4],time:'19:30',timeZone:chicago}},
 {id:'magic-members-fall26',title:'Aggie Magic Circle: Member Meeting',description:'Bring a deck of cards and practice magic with other students.',clubSlug:'magic',location:'Memorial Student Center 1402',lat:30.612309,lng:-96.341378,sourceUrl:'https://getinvolved.tamu.edu/org/magic/events/26557/511008',category:'campus',durationMinutes:60,rule:{start:'2026-11-05',until:'2026-11-19',weekdays:[4],intervalWeeks:2,time:'19:00',timeZone:chicago}},
 {id:'magic-practice-fall26',title:'Aggie Magic Circle: Practice Meeting',description:'Officer practice session; members are welcome to join and practice.',clubSlug:'magic',location:'Memorial Student Center 1402',lat:30.612309,lng:-96.341378,sourceUrl:'https://getinvolved.tamu.edu/org/magic/events/26557/511008',category:'campus',durationMinutes:60,rule:{start:'2026-11-12',until:'2026-11-12',weekdays:[4],time:'19:00',timeZone:chicago}},
];
export function scheduledCampusEvents(now=new Date()):(InsertEvent & {id:string})[] {
 const recurring = eventSeries.flatMap(s=>occurrences(s.rule,now).map(o=>({
   id:`tamu-event-${s.id}-${o.localDate}`,title:s.title,description:s.description,category:s.category,
   location:s.location,dateTime:o.at,clubId:`tamu-${s.clubSlug}`,clubName:clubs.find(c=>c.slug===s.clubSlug)?.title,
   organizerName:clubs.find(c=>c.slug===s.clubSlug)?.title,contactInfo:s.sourceUrl,
   tags:['recurring','TAMU'],attendeeCount:0,cost:s.free?'Free':null,
   locationDetails:`Posted recurring schedule · America/Chicago · through ${s.rule.until}`,
   locationLat:s.lat??null,locationLng:s.lng??null,
   traitSocial:0.8,traitCreativity:s.clubSlug==='magic'?0.8:0.5,
 })));
 const explicit = rhaOccurrences.filter(e=>e.series==='rha-general').map(e=>({id:`tamu-event-rha-${e.date}`,title:e.title,description:e.description,category:'campus',dateTime:localDateTimeToUtc(e.date,e.startTime,e.timeZone),location:e.location,locationLat:e.location.startsWith('Commons')?30.615285:30.61646,locationLng:e.location.startsWith('Commons')?-96.335948:-96.346322,organizerName:e.organizer,contactInfo:e.url,tags:['recurring','TAMU'],locationDetails:'Published recurring series · America/Chicago',attendeeCount:0})).filter(e=>e.dateTime>=now);
 return [...recurring,...explicit];
}
export function eventSource(id:string) {
 const s=eventSeries.find(s=>id.startsWith(`tamu-event-${s.id}-`));
 const rha=rhaOccurrences.find(e=>id===`tamu-event-rha-${e.date}`);
 if(rha) return {sourceUrl:rha.url,verifiedAt:CATALOG_CHECKED_AT,recurring:true,timeZone:rha.timeZone,validUntil:'2026-12-01'};
 return s?{sourceUrl:s.sourceUrl,verifiedAt:CATALOG_CHECKED_AT,recurring:true,timeZone:s.rule.timeZone,validUntil:s.rule.until}:{};
}
