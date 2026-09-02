# Author trust checklist

Author pages already support `expertise`, `credentials` and `sameAs`; the Person
schema mirrors those fields. Leave a field empty rather than inventing a signal.

For each named contributor, confirm and add only what the person has approved:

- a personal LinkedIn, portfolio or previous-publication profile in `sameAs`;
- specific, verifiable credentials relevant to their beat;
- a factual biography without unverifiable tenure, access or experience claims;
- a clear editorial role and areas of expertise;
- a headshot with documented permission and credit.

Use `reviewedBy` on an article only after that editor has actually reviewed the
piece. Use `updatedDate` and `correctionNote` only when the corresponding change
has happened. The content validator fails unresolved reviewer identities.
