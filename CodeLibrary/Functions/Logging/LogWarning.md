---
title: "LogWarning"
description: "Adds a user warning and raises the current flow's overall status to Warning without directly stopping processing."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - warning
  - flow-status
  - dialog
---

```Delphi
procedure LogWarning(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = '' then
    LogWarning('The optional source value is empty; the default will be used.');
end;
```

### Usage

`LogWarning` adds a user warning and raises the current flow's overall status to Warning without directly stopping processing.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | Warning detail stored at custom user level 40. Empty and multiline text are accepted. |

### Additional Technical Info
`LogWarning` adds a user Warning item and raises the overall flow status to `flsWarning` when it is currently lower. Warning leaves the Boolean flow status true, so current and later processing normally continues.

Under a narrow foreground condition it can also display a modal warning dialog. Do not assume service and Designer execution have identical user-interface effects. The example is fictional and source-reviewed only.

**Implementation trace**

`TvxScripter.LogWarning` calls `Log.MessageLog(aMesg, 40)`. Level 40 raises overall status to Warning, creates an item whose status is `flsWarning`, sets `User=True`, and gives the caption `User Warning`.

**Status and control flow**

Warning replaces Successful status but does not reduce Issue, Duplicate, Cancelled or Error. It does not set `Log.Status` false and does not exit the script. A later, higher status can replace it.

Warnings are included in the default save-status set and can select configured notification content. Calling the procedure does not guarantee persistence or email because the final status and flow settings remain authoritative.

**Possible foreground dialog**

After creating the log item, `MessageLog` routes level 40 to `MessageWarning` only when the current log has no item-added listeners, execution is foreground and on the main thread, and the log is not the global system log. That route displays a modal warning dialog and also adds a warning to the system log when available.

If any condition is false, no dialog is shown by this function. Service/background calls therefore normally remain noninteractive. A foreground automation that meets the condition can block waiting for a user.

**Text, privacy and limits**

There is no formatting, trim or redaction. Messages can appear in the action log, system log under the dialog path, notification material and support workflows. Do not include secrets or unnecessary personal data.

The normalized `VX_LOG_ITEM` description is limited to a 448- or 840-character prefix according to database compatibility, while serialized log content can retain more. No immediate application-database query occurs during the ordinary action-log call.

**Related entries**

- [`LogInfo`](LogInfo.md) adds information without changing overall status.
- [`LogIssue`](LogIssue.md) raises the status to business Issue.
- [`LogError`](LogError.md) makes status false, attaches the script and may show an error dialog.
- [`MessageInfo`](MessageInfo.md) targets a foreground information dialog or background system/Windows event instead of the action log.

<small>Created 2026-07-15</small>
