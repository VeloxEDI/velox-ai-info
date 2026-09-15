---
title: "GUID"
description: "Functions for creating, parsing, testing and formatting GUID values and GUID-shaped SQL or filename text."
sidebar_position: 15
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - uuid
  - identifiers
---

The GUID group works with Delphi `TGuid` records and common textual representations. Use it to create a Windows UUID, represent the all-zero sentinel, parse supplied text or convert an identifier for a filename, display field or legacy SQL fragment.

## Common tasks

- Use [`NewGuid`](Guid/NewGuid.md) when a `TGuid` record is required, or the `NewGuidString...` entries for the exact documented text form.
- Use [`EmptyGuid`](Guid/EmptyGuid.md), [`EmptyGuidString`](Guid/EmptyGuidString.md) and [`IsEmptyGuid`](Guid/IsEmptyGuid.md) for the all-zero sentinel.
- Use [`SafeStringToGuid`](Guid/SafeStringToGuid.md) for its specific empty/bracing behavior, not as a general validation promise.
- Use [`GUIDToStringNoBraces`](Guid/GUIDToStringNoBraces.md) when a canonical 36-character hyphenated form without braces is required.

## Representation rules

A GUID record and a GUID string are different types. Text can include or omit braces and has a defined hyphen layout and hexadecimal case on the output paths. Compare identifiers as `TGuid` values or as one canonical text representation; do not compare a mixture of optional braces and arbitrary casing.

The all-zero GUID is a conventional sentinel in many Velox contracts, not SQL `NULL` and not an absent Variant. Check the owning module or database column's meaning before translating between them.

## Important behaviour and quirks

Creation delegates to Windows, but the current helper family does not uniformly surface the operating-system status. A generated value is intended to be practically unique; it is not proof of authorization, secrecy, ordering or successful persistence.

`NoBraces` is a text helper with deliberately weak validation: an opening brace can cause first/last-character removal without proving the content is a GUID or even has a closing brace. `SafeStringToGuid` also has exact brace-detection and empty-input rules described on its page; malformed non-empty input can still raise.

[`GUIDToSQL`](Guid/GUIDToSQL.md) produces a quoted literal fragment. It does not bind a parameter, escape arbitrary surrounding SQL or implement database null semantics. Prefer typed parameters when possible.
