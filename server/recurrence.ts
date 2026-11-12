// Recurrences are local wall-clock rules, never a sliding number of days from deploy.
export interface Recurrence {
  start: string; until: string; weekdays: number[]; time: string;
  timeZone: string; intervalWeeks?: number; excludedDates?: string[];
}
export function localDateTimeToUtc(date: string, time: string, timeZone: string): Date {
  const wall = Date.parse(`${date}T${time}:00Z`);
  let result = wall;
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' });
  for (let i=0;i<3;i++) {
    const p = Object.fromEntries(formatter.formatToParts(new Date(result)).map(v=>[v.type,v.value]));
    const actual = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    result += wall-actual;
  }
  return new Date(result);
}
export function occurrences(rule: Recurrence, now: Date, horizonDays = 45): { localDate:string; at:Date }[] {
  const start = Date.parse(`${rule.start}T12:00:00Z`);
  const end = Date.parse(`${rule.until}T12:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || end-start > 370*86400000) throw new Error('A recurrence needs a finite verified window of at most one year');
  const result=[];
  const horizon=now.getTime()+horizonDays*86400000;
  for(let day=start;day<=end;day+=86400000) {
    const localDate=new Date(day).toISOString().slice(0,10);
    if(!rule.weekdays.includes(new Date(day).getUTCDay()) || rule.excludedDates?.includes(localDate)) continue;
    if(Math.floor((day-start)/(7*86400000)) % (rule.intervalWeeks||1) !== 0) continue;
    const at=localDateTimeToUtc(localDate,rule.time,rule.timeZone);
    if(at.getTime()>=now.getTime() && at.getTime()<=horizon) result.push({localDate,at});
  }
  return result;
}
