# TAMU catalog, verified 2026-11-12

The public organization pages in `server/data/tamu-clubs.json` support club identities and short paraphrased descriptions. Meeting times, dues, popularity and affiliation claims not verified there are intentionally absent. Interest trait weights are editorial heuristics, not organizer facts.

Events are drawn from official published recurring series. The rules and links are in `server/campus-catalog.ts`; exact future occurrence references are retained in `server/data/tamu-events.json`. Current coverage is Swap Store, Eco-Rep general meetings, Aggie Magic Circle and RHA General Assembly. The first three have November 19 as their last published date; RHA has a December 1 occurrence. They do not repeat indefinitely. The two Magic Circle types are separate to avoid advertising an officer practice as a general member meeting. RHA uses explicit dates because locations vary.

## Behavior
- Chicago wall times convert to UTC with the IANA timezone; DST is tested.
- Stable IDs include series and local date. Hourly-on-read and startup upserts are idempotent; retries do not create another RSVP target.
- Future queries filter against the current verified schedule. Past occurrences remain stored for genuine user history; they do not silently roll to next week.
- Old sample clubs are retained in the database for reversibility, but filtered from discovery/profile lookups. No users, interactions or RSVP records are deleted.
- Source links are available on event cards. Persona's Interested button is local to Persona, not registration with a club.
- No fake members, attendance, friends, popularity counts or social proof are created.
- This is a curated snapshot, not a live scraper or ongoing re-verification service. Renew published schedules before extending their valid windows. An empty future feed after expiry is preferable to invented dates.

## Locations
Building-level coordinates are from the official Aggie Map data queried 2026-11-12:
https://gis.tamu.edu/arcgis/rest/services/Hosted/VTBase3/FeatureServer/0
Fields `bldg_number`, `bldgname`, `latitude`, `longitude`:
- 0454 Memorial Student Center: 30.612309, -96.341378
- 1416 Hullabaloo Residence Hall: 30.61646, -96.346322
- 0440 Commons: 30.615285, -96.335948
These indicate buildings, not precise rooms or entrances. Clubs without verified meeting places are not scattered across the map.

## Checks
`npm run check && npm test && npm run build`
Tests cover official-source catalog constraints, nine upcoming occurrences at the Nov12 cutoff, DST, finite windows, exclusions, intervals and restart stability.
