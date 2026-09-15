---
title: Records
description: Understand the value-copy and Windows time-layout rules for the record type exposed to Velox scripts.
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, records, filetime, windows, layout]
---

## Available record

The current public Records branch contains one record and its two fields:

| Record | Fields | Meaning | Primary risk |
|---|---|---|---|
| [`TFileTime`](Records/TFileTime.md) | [`dwLowDateTime`](Records/TFileTime/dwLowDateTime.md), [`dwHighDateTime`](Records/TFileTime/dwHighDateTime.md) | Windows unsigned 64-bit FILETIME split into low/high 32-bit halves | Neither field is independently a date/time; no public script conversion helper currently consumes the record. |

## Record rules

- A record is a value. Assignment and by-value parameters copy every field; it has no object identity or `Free` method.
- Access fields with dot notation and initialize every field before treating a record as a complete external value.
- This imported record has data fields only. Delphi record helpers, methods, operators and Windows conversion functions are not automatically available to Velox scripts.
- Field order describes the logical native structure, but scripts must not serialize raw in-memory record bytes as a portable interchange format.
- Validate range, units, epoch, timezone and sentinel rules at the API that produces or consumes a record. The declaration alone does not supply them.

`TFileTime` is currently present as structural reference knowledge: no public entry in the current Code Library index accepts or returns it. Use [`TDateTime`](DataTypes/TDateTime.md) for script-facing date/time functions that explicitly declare that type; it is a different representation and must not be populated from one FILETIME half.

**External references**

- [Microsoft FILETIME](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime) - authoritative Windows layout, epoch and conversion cautions.
- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi record/value semantics.
- [Free Pascal record types](https://www.freepascal.org/docs-html/current/ref/refsu15.html) - compatible record field and layout concepts.

<small>Created 2026-07-15</small>
