---
title: "MessageInfo"
description: "Shows an information dialog on the foreground main thread or writes information to the system and Windows event logs in background execution."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - information
  - dialog
  - windows-event-log
  - background
---

```Delphi
Procedure MessageInfo(
  const AMessage: string;
  HelpID: LongInt)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Foreground use can block on an OK dialog. HelpID is ignored.
  MessageInfo('The validation step has completed.', 0);
end;
```

### Usage

`MessageInfo` shows an information dialog on the foreground main thread or writes information to the system and Windows event logs in background execution.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AMessage` | `string`, `const` | Text shown in the dialog or passed to system/Windows event logging. No redaction or formatting is applied. |
| `HelpID` | `LongInt` | Accepted for legacy signature compatibility but ignored by Velox in both branches. Any value has the same behavior. |

### Additional Technical Info
`MessageInfo` selects one of two destinations from process/thread context:

- on the foreground main thread, it shows a modal information dialog titled `Info`; or
- in background mode or on any non-main thread, it writes Information to the Velox system log and attempts a Windows Application event.

It does **not** add an ordinary item to the current action log through either branch. Use [`LogInfo`](LogInfo.md) for action-log information. The example can be interactive and was not executed.

**Foreground main-thread path**

When `IsBackground=False` and `IsMainThread=True`, Velox calls `DialogInfo('Info', AMessage, '')`. The dialog implementation uses a VCL `TTaskDialog` with an OK button on supported/themed Windows, otherwise a standard `MessageDlg`.

Both forms are modal: the script blocks until the user dismisses the message. This path does not write the action log, the Velox system log or Windows event log. It is unsuitable for unattended foreground automation and high-volume record loops.

**Background/non-main-thread path**

Velox calls `gEventLogger.LogMessage(AMessage, EVENTLOG_INFORMATION_TYPE)`. Under an event-logger monitor lock, that method:

1. adds the original message to `gSystemLog` at system information level 20 when the global system log exists;
2. obtains/registers a Windows Application event source named from the executable filename;
3. chooses the information event identifier expected by `vxEventMessages.dll`; and
4. calls Win32 `ReportEvent` with the message.

This is system-level diagnostic logging, not the flow's `TvxLog` item list.

**Failure and delay quirks**

If the Windows event-source handle is zero, `LogMessage` makes up to three registration attempts and sleeps two seconds after each failure, including the final one. A call can therefore block the background thread for about six seconds before giving up. Calls are serialized by the same lock, so other event-log writers can wait behind it.

The Boolean result from Win32 `ReportEvent` is ignored, and the function returns no success status. Missing permissions, event-source/message-DLL problems, event-size limits or Windows event-log failures may leave only the Velox system-log copy (when available), with no indication to the script.

During application initialization Velox attempts to create/repair the Application event-source registry key under `HKLM`; permission failure is handled as a best-effort condition. `HelpID` is unrelated to this registration.

**Status, privacy and limits**

Neither branch changes current flow Warning/Issue/Error status. Background system logging can have its own persistence behavior. Foreground presentation alone is not durable evidence.

Messages can become visible to interactive users, Windows Event Viewer readers and system-log/support users. Do not include credentials, tokens or unnecessary personal data. Windows imposes event-message size constraints; Velox performs no preflight length check and ignores the final API result.

**Related entries**

- [`LogInfo`](LogInfo.md) adds a user information item to the current action log without a dialog.
- [`LogWarning`](LogWarning.md) and [`LogError`](LogError.md) add action-log status items and may show conditional foreground dialogs through a different path.
- [`LogHighlight`](LogHighlight.md) adds a prominent Note in the action log.

**External references**

- [Microsoft `ReportEventW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-reporteventw)

<small>Created 2026-07-15</small>
