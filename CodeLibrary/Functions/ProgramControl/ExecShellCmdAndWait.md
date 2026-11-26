---
title: "ExecShellCmdAndWait"
description: "Opens an item through ShellExecuteEx and waits at most one hour when Windows returns a process handle."
sidebar_position: 5
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
  - blocking
  - security
---

```Delphi
function ExecShellCmdAndWait(const aCommand, aParams: string): DWORD;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ExitCode: DWORD;
begin
  ExitCode := ExecShellCmdAndWait('C:\Tools\Exporter.exe', '--daily');
  if ExitCode = 83569 then
  begin
    LogError('Windows could not start the exporter process.');
    Exit;
  end;
  if ExitCode <> 0 then
  begin
    LogError('Exporter exit code: ' + IntToStr(ExitCode));
    Exit;
  end;
  Value := 'Export complete';
end;
```

### Usage

`ExecShellCmdAndWait` opens an item through ShellExecuteEx and waits at most one hour when Windows returns a process handle.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aCommand` | `string` | Executable, document, folder or URL passed as the Shell item. |
| `aParams` | `string` | Parameter string for the executable or associated handler. |

**Returns**

| Value | Meaning |
|---|---|
| Process exit code | The Shell returned a process handle, the wait ended and Velox read its exit code. |
| `0` with no process handle | The Shell accepted the request but there was nothing Velox could wait on, for example because an existing application handled a document. This does not prove the document-level operation completed. |
| `83569` | Velox's initial sentinel remained unchanged, normally because `ShellExecuteExW` failed. A real process can also return this value. |

### Additional Technical Info
`ExecShellCmdAndWait` asks the Windows Shell to open an executable, document, folder or URL and requests a process handle. When a handle is returned, it blocks the current Velox thread for up to one hour and returns the process exit code. When Windows accepts the request but supplies no process handle, it returns zero immediately.

Shell associations make completion semantics inherently weaker than direct process creation: an already-running application may receive a document or URL without creating a new process. The example uses an executable with a defined exit code, is fictional and is source-reviewed only.

**Implementation**

Velox zeroes a `SHELLEXECUTEINFO` record and sets `SEE_MASK_NOCLOSEPROCESS`, the item, parameters and `SW_SHOWNA`. It supplies owner window zero for background/non-main-thread execution or the Designer application handle on the main interactive thread. It does not set an explicit verb, so Windows uses the default verb, normally `open`.

After a successful `ShellExecuteExW` call:

1. a null `hProcess` produces an immediate result of zero;
2. otherwise Velox waits using a one-hour timeout;
3. `WAIT_TIMEOUT` raises an exception immediately;
4. any other wait result is followed by `GetExitCodeProcess`; and
5. the process handle is closed in a `finally` block.

**Blocking, cancellation and UI**

The wait blocks the Velox worker and does not inspect flow cancellation or pump window messages. A timeout does not terminate the external process. Interactive handlers can wait invisibly for input in a service session, making this API unsuitable for unattended document/UI automation unless the handler is explicitly designed for it.

`SW_SHOWNA` permits a window to be shown without activation; it does not guarantee hidden execution. The chosen association and its process-reuse policy determine whether a window appears and whether a process handle is available.

**Errors and quirks**

- The Shell failure details are collapsed into sentinel `83569`; the wrapper adds no automatic error log.
- `GetExitCodeProcess` and non-timeout wait return values are not checked. A failure can leave the sentinel unchanged or return an ambiguous code.
- The timeout exception text uses Delphi's global process `CmdLine` variable rather than the supplied `aCommand`. Its displayed command can therefore be unrelated to the item that timed out.
- The timeout message can still reveal process command-line content in logs.
- A null-handle result of zero is indistinguishable from a child that actually ran and returned zero.
- Shell execution and the child are not part of Velox's database transaction and are not reversed by flow cancellation.

Treat both arguments as trusted/validated inputs. File associations, user profiles, mapped drives, permissions and visible desktops differ between Designer and service accounts.

**Related entries**

- [`ExecShellCmd`](ExecShellCmd.md) never waits.
- [`ExecCmdLineAndWait`](ExecCmdLineAndWait.md) creates a process directly and always receives handles when creation succeeds.

**External references**

- [Microsoft Learn: `ShellExecuteExW`](https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shellexecuteexw)
- [Microsoft Learn: `WaitForSingleObject`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject)
- [Microsoft Learn: `GetExitCodeProcess`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getexitcodeprocess)

<small>Created 2026-07-15</small>
