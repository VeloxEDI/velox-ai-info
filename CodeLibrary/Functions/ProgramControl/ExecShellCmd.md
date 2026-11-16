---
title: "ExecShellCmd"
description: "Opens an executable, document, folder or URL through the Windows Shell open verb without waiting."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - velox
  - scripting
  - program-control
  - shell
  - windows
  - security
---

```Delphi
function ExecShellCmd(const aCommand, aParams: string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if not ExecShellCmd('C:\Data\summary.pdf', '') then
  begin
    LogError('Windows could not open the summary.');
    Exit;
  end;
  Value := 'Windows accepted the open request';
end;
```

### Usage

`ExecShellCmd` opens an executable, document, folder or URL through the Windows Shell open verb without waiting.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aCommand` | `string` | Executable, document, folder or URL passed as the Shell file/object. |
| `aParams` | `string` | Parameter string passed to the selected executable or handler. Use an empty string for a document or URL that needs no extra parameters. |

**Returns**

Returns `True` when `ShellExecuteW` produces a value greater than 32, meaning that Windows accepted the request. Returns `False` for Shell error values 32 or lower.

Success does not prove that a new process was created, that the handler stayed running, that the item opened visibly or that the requested work completed. No process handle or exit code is retained.

**Security and service behaviour**

Opening an untrusted path or URL can execute code through the selected handler. Treat both arguments as security-sensitive and prefer allow-listed schemes, executable paths and directories. Do not pass credentials or secrets on a command line unless the target's security model explicitly requires it.

In a service context, desktop-interactive applications can hang invisibly, display prompts no operator can answer, fail because there is no association for the service account, or behave differently from the Designer. Mapped drives and per-user file associations may also be unavailable.

### Additional Technical Info
`ExecShellCmd` asks the Windows Shell to perform the `open` verb for a command or item and returns immediately. Unlike [`ExecCmdLine`](ExecCmdLine.md), it can use registered file and URL associations: `aCommand` may be an executable, document, folder or URI, and Windows chooses the associated handler.

This function is most predictable in interactive Designer use. A Velox service normally has no interactive desktop and can have different or missing per-user associations. The example is fictional and source-reviewed only.

**Implementation**

Velox calls `ShellExecuteW` with:

- the explicit verb `open`;
- `aCommand` as `lpFile` and `aParams` as `lpParameters`;
- an empty working-directory argument;
- `SW_SHOWNA`, which shows a window without activating it; and
- owner window zero in a background/non-main thread, otherwise the Designer application's window handle.

The Shell interprets the item using the registrations, policies and session of the running account.

**Errors and concurrency**

The Boolean result collapses every Shell failure code into `False`; Velox does not expose the specific code or log the failing item. The call is non-blocking and cannot be cancelled or joined by Velox afterward. Multiple records can issue concurrent open requests, and an existing application can service several requests within one process.

Use [`ExecShellCmdAndWait`](ExecShellCmdAndWait.md) only when the association is expected to return a usable process handle and its exit status has a defined meaning. Even that function cannot always wait when an existing application handles the item.

**Related entries**

- [`ExecShellCmdAndWait`](ExecShellCmdAndWait.md) requests a process handle and waits when one is supplied.
- [`ExecCmdLine`](ExecCmdLine.md) directly creates a named process without Shell association resolution.

**External references**

- [Microsoft Learn: `ShellExecuteW`](https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shellexecutew)

<small>Created 2026-07-15</small>
