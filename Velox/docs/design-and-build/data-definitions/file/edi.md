---
title: "EDI definitions"
description: "Configure EDI segment, element, component and release characters and model segment records in Velox."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [EDI, segment terminator, element delimiter, escape character, UNA]
---

An EDI File Definition models segment-based data and its separator characters. The initial delimiter defaults match common UN/EDIFACT syntax, but the trading-partner agreement—not the defaults—controls the production values.

| Setting | Default code/character | Effect |
| --- | --- | --- |
| **Segment Terminator** | `39` / apostrophe (`'`) | Ends an EDI segment. |
| **Element Delimiter** | `43` / plus (`+`) | Separates data elements in a segment. |
| **Sub-element / Component Delimiter** | `58` / colon (`:`) | Separates component values within an element. |
| **Escape / Release Character** | `63` / question mark (`?`) | Allows separator characters to appear as data according to the EDI syntax. |
| **Auto-detect Record Delimiter** | Cleared | Can detect record separators, including from a leading `UNA` service string where supported. Explicit contract values remain preferable. |
| **Encoding** | ANSI | Inherited file encoding; set it to the interchange agreement and test extended characters. |

Values are stored as integer character codes. Record the visible character and numeric code during peer review so whitespace and punctuation cannot be misread.

## Design and verify

1. Obtain the message implementation guide and representative valid/invalid interchanges.
2. Attach a test [File Connection](../../connections/file/index.md) and set the syntax characters exactly.
3. In **Design**, create dataview records for the segments Velox must process and stable fields for their elements/components.
4. Model repetitions, optional segments, loops and envelope/message relationships required by the implementation.
5. Test escaped separator characters, missing mandatory data, unexpected segments, repeated groups, line breaks and interchange encoding.
6. Generate output and validate it with the trading partner's validator or agreed test service.

Auto-detection of separators does not define the segment model and does not validate the business message. Ignore-undefined-record and ignore-invalid-line options default to cleared; leave them cleared unless the operational design explicitly reconciles skipped content. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing shared segment or field identities.
