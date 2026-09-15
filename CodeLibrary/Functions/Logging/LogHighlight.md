---
title: "LogHighlight"
description: "Adds a highlighted Note item to the current flow log without changing its overall status."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - highlight
  - note
---

```Delphi
procedure LogHighlight(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  LogHighlight('Fallback mapping rules were applied to this record.');
end;
```

### Usage

`LogHighlight` adds a highlighted Note item to the current flow log without changing its overall status.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Text stored on a Velox level-8/highlight item. Empty and multiline text are accepted. |

### Additional Technical Info
`LogHighlight` adds a visually highlighted log item whose display caption is `Note`. It is useful for drawing attention to diagnostic or exceptional-but-nonstatus information. It does not change the overall flow status, stop processing or mark the flow as successful.

The example is fictional and source-reviewed. No script or flow was executed.

**Implementation trace**

`TvxScripter.LogHighlight` delegates to `TvxLog.Highlight`, which calls `MessageLog` with `Ord(flsHighlight)=8`. `MessageLog` deliberately has no overall-status assignment for level 8, but it still creates a `TvxLogItem`. Assigning the item's level maps its item status to `flsHighlight`; the status string for that value is `Note`.

This split is important: `flsHighlight` is numerically above Error in the native enumeration, but a highlight item does **not** raise `Log.StatusType` to Highlight. The current flow can remain Successful, Warning, Issue, Duplicate, Cancelled or Error independently.

**Persistence and visibility**

The item is owned by the current action log and is persisted only when that enclosing log is saved. The final overall status, not the item's level, is evaluated against configured save statuses. A highlighted item in an otherwise unsaved status can therefore be lost from durable logs.

Highlighting is a Velox log presentation concept. It does not show a modal dialog, send a notification by itself, alter mapped data or create a transaction issue.

**Text and limits**

Velox does not trim, format, redact or validate the message. The normalized log-item row stores only the configured database prefix of long descriptions (448 or 840 characters), while the serialized log can retain more. Avoid secrets and large data dumps.

No immediate database or external I/O occurs. Normal allocation failures can propagate.

**Related entries**

- [`LogInfo`](LogInfo.md) adds ordinary user information without changing overall status.
- [`LogTest`](LogTest.md) adds a Test item only in test mode.
- [`LogWarning`](LogWarning.md) changes overall status to Warning when lower.
- [`TvxLogStatusType`](../../Types/Enumerations/TvxLogStatusType.md) includes the separate native highlight item status.

<small>Created 2026-07-15</small>
