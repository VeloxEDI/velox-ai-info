---
title: "LogInfo"
description: "Adds a user information item to the current flow log without changing the flow's overall status."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - information
  - diagnostics
---

```Delphi
procedure LogInfo(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  LogInfo('The optional reference value was not supplied; processing continues.');
end;
```

### Usage

`LogInfo` adds a user information item to the current flow log without changing the flow's overall status.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Text stored as custom level 50, which maps to a `User Info` log item. Empty and multiline text are accepted. |

### Additional Technical Info
`LogInfo` adds a user-classified information item to the current flow log. It does not change overall flow status, control execution, display an information dialog or write directly to the Windows event log.

Use [`MessageInfo`](MessageInfo.md) when the requirement is an interactive foreground message or background system/Windows event. Use `LogInfo` when the information belongs in the action execution log. The example is fictional and source-reviewed only.

**Implementation trace**

1. `TvxScripter.LogInfo` calls `Log.MessageLog(aMesg, 50)`.
2. Level 50 has no overall-status branch in `MessageLog`.
3. A `TvxLogItem` is created with the description and level.
4. `TvxLogItem.SetLevel(50)` assigns item status `flsOK` and `User=True`.
5. The log end time is advanced to the item's creation time.

The item caption is `User Info`. Existing Warning, Issue, Duplicate, Cancelled or Error status remains unchanged.

**Persistence and notifications**

The call changes only the in-memory current log. Durable persistence occurs later if the flow's final overall status is included in its configured save-status set. The default set saves Successful, Warning, Issue, Duplicate and Error, but not Cancelled.

An information item does not select a notification category or force an email. It can appear in a notification generated for the enclosing log according to that log's final status and configuration.

**Data handling and limits**

No formatting, trim, deduplication or redaction is applied. Do not log credentials, authentication headers or full sensitive payloads. Very frequent row-level calls can create large in-memory and persisted logs.

When normalized into `VX_LOG_ITEM`, only the first 448 or 840 characters of `Description` are stored according to the database-support branch. The serialized log representation can retain more. No immediate database access occurs during the call.

**Related entries**

- [`MessageInfo`](MessageInfo.md) has a different UI/system-event destination and ignores its HelpID.
- [`LogHighlight`](LogHighlight.md) adds a visually emphasized Note without changing overall status.
- [`LogTest`](LogTest.md) is emitted only in test mode.
- [`LogWarning`](LogWarning.md), [`LogIssue`](LogIssue.md) and [`LogError`](LogError.md) affect overall status.

<small>Created 2026-07-15</small>
