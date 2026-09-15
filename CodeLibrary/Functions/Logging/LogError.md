---
title: "LogError"
description: "Adds a user error with the current script to the flow log and changes flow status so normal processing stops."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - error
  - flow-status
  - script-disclosure
---

```Delphi
procedure LogError(const aMesg: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Value = null then
  begin
    LogError('A required source value is null.');
    Exit; // Prevent later statements in this procedure from running.
  end;
end;
```

### Usage

`LogError` adds a user error with the current script to the flow log and changes flow status so normal processing stops.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | User-facing error explanation stored at custom level 30. Empty text is accepted. |

### Additional Technical Info
`LogError` adds a user Error item to the current flow log, attaches a copy of the current script to that item, and changes the overall flow state to Error. Error makes the log's Boolean `Status` false, so the action engine stops normal step processing after the current script call returns.

The procedure does not raise an exception or automatically exit the current script procedure. Use `Exit` when later statements in that same procedure must not execute. The example is fictional and source-reviewed only.

**Implementation trace**

1. `TvxScripter.LogError` calls `Log.MessageLog(aMesg, 30)`.
2. `MessageLog` raises the overall status to `flsError`, which sets Boolean `Log.Status := False`.
3. It creates a log item with level `30`; that level maps to status Error and `User=True`.
4. It may display a foreground error dialog under the conditions below.
5. The returned log item receives `AddScript(FScript)`, copying the entire current script into the item.

The display caption is `User Error`. The attached script is diagnostic context, not only the line that called `LogError`.

**Foreground dialog behavior**

`MessageLog` calls the GUI error-message path only when all of these are true:

- the log has no `OnItemAdded` listeners;
- Velox is not in background mode;
- the log is not the global system log; and
- execution is on the main thread.

In that case a modal error dialog can block until a user responds. Designer/log-viewer listeners commonly alter this path. Background service execution adds the action-log item without showing the dialog through this branch.

**Flow, transaction and retry effects**

Once Error is set, lower status calls cannot reduce it. The outer action loop stops, configured database finalization normally rolls transactions back, failed source files can follow error handling, and deferred invoice issues are not saved. Auto-retry configuration can later reset status for a new attempt; this function itself does not retry or roll anything back.

External effects already committed by earlier script statements are not reversed automatically. Calling `LogError` is a flow-status operation, not a transaction primitive.

**Sensitive diagnostic content**

Both `aMesg` and the entire current script can be persisted in the governed log and exposed to users with log access or included in support/notification workflows. Never embed credentials or private keys in scripts. Avoid placing tokens, payloads or personal data in the message.

The normalized `VX_LOG_ITEM.Description` stores a prefix of a long message (448 characters in the SQL-2014-support branch, otherwise 840). Script content is carried by the serialized log-item representation rather than that description column.

**Errors and limits**

There is no immediate database write, message formatting or redaction. Memory/allocation and GUI failures can propagate. Later log persistence may fail independently and can add further system-error items.

**Related entries**

- [`LogWarning`](LogWarning.md) records a nonfatal user warning and may show a warning dialog.
- [`LogCancel`](LogCancel.md) stops later steps through cancelled status while leaving the Boolean status true.
- [`LogIssue`](LogIssue.md) and [`LogDuplicate`](LogDuplicate.md) record nonfatal business states.
- [`LogInfo`](LogInfo.md) and [`LogHighlight`](LogHighlight.md) add items without changing overall status.

<small>Created 2026-07-15</small>
