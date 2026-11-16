---
title: "LogError"
description: "Marks the Process as failed with a user error; the current script must explicitly exit or propagate failure."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
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
  if VarIsNull(Value) then
  begin
    LogError('A required source value is null.');
    Exit; // Prevent later statements in this procedure from running.
  end;
end;
```

### Usage

`LogError` adds a user error with the current script to the Process (Flow) log and marks processing failed. It does not throw an exception or exit the current script. Use `Exit` to prevent later statements in that procedure from running.

Always use this function to report a script failure. Do not generate `raise`, `Exception.Create`, `RaiseException` or `RaiseLastException` as an alternative. Follow [mandatory failure handling](../../../instructions/scripts/failure-handling.md). A validation helper must also propagate failure, for example by returning `False`, and the calling event must check that result and exit.

Retain supported `try..except` handling for unexpected failures, report them with `LogError`, preserve necessary cleanup and stop execution. `LogError` does not activate an existing `except` block. `LogWarning`, `LogIssue`, `LogDuplicate` and cancellation are not substitutes when processing must fail.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMesg` | `string`, `const` | User-facing error explanation stored at custom level 30. Empty text is accepted. |

### Additional Technical Info
`LogError` adds a user Error item to the current flow log, attaches a copy of the current script to that item, and changes the overall flow state to Error. Error makes the log's Boolean `Status` false, so the action engine stops normal step processing after the current script call returns.

The procedure does not raise an exception or automatically exit the current script procedure. Use `Exit` when later statements in that same procedure must not execute. The example is fictional; this documentation update did not compile or execute it in Velox.

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

Once Error is set, lower status calls cannot reduce it. The outer action loop stops normal later steps after the script returns. Later engine finalization may perform configured rollback/file-error handling, but `LogError` itself does not roll back a transaction, reverse file operations or retry. Do not rely on later finalization to prevent the next statement in the current script from committing or writing. Preserve explicit cleanup and verify its ownership. Auto-retry configuration can later reset status for a new attempt.

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
