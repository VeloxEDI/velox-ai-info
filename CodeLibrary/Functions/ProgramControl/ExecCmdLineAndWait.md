---
title: "ExecCmdLineAndWait"
description: "Starts a hidden Windows process, waits at most one hour and returns its DWORD exit code or Velox's failure sentinel."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - process
  - windows
  - blocking
  - security
---

```Delphi
function ExecCmdLineAndWait(const CmdLine: string): DWORD;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ExitCode: DWORD;
begin
  ExitCode := ExecCmdLineAndWait('"C:\Tools\Validator.exe" "C:\Data\orders.json"');

  if ExitCode = 83569 then
    raise Exception.Create('Windows could not create the validator process');
  if ExitCode <> 0 then
    raise Exception.Create('Validator exit code: ' + IntToStr(ExitCode));

  Value := 'Validated';
end;
```

### Usage

`ExecCmdLineAndWait` starts a hidden Windows process, waits at most one hour and returns its DWORD exit code or Velox's failure sentinel.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `CmdLine` | `string` | Complete executable-and-arguments command line passed to `CreateProcessW`. Quote executable paths and arguments for Windows and the target program. |

**Returns**

| Value | Meaning |
|---|---|
| Child exit code | Windows created the process, the wait ended and Velox copied the process exit code. The meaning is defined by the child program. |
| `83569` | Velox's initial sentinel remained unchanged, normally because Windows could not create the process. |
| `STILL_ACTIVE` (`259`) | Possible if the wait result was not a normal termination and `GetExitCodeProcess` reports that the process is still active. Treat it as ambiguous rather than a successful business result. |

The sentinel is not reserved by Windows. A real child can itself return `83569`, so the caller cannot distinguish that exit code from creation failure.

### Additional Technical Info
`ExecCmdLineAndWait` creates a Windows process from one complete command-line string, blocks the current Velox thread until the child terminates, then returns the child's unsigned 32-bit exit code. Process-creation failure returns the Velox-specific sentinel `83569`; a wait that remains timed out for one hour raises an exception.

The wrapper requests a hidden initial window and uses the current Designer or service identity. Treat commands and arguments as privileged inputs. The example is fictional and source-reviewed only; documentation validation does not run it.

**Implementation sequence**

1. Set the result to `83569`.
2. Initialise `STARTUPINFO` with `STARTF_USESHOWWINDOW` and `SW_HIDE`.
3. Call `CreateProcessW` with `lpApplicationName=nil`, the caller's full command line, no inherited handles, a new console, normal priority, and inherited environment/current directory.
4. If creation succeeds, call `WaitForSingleObject` with a one-hour timeout.
5. If that call returns `WAIT_TIMEOUT`, raise an exception immediately; despite the source's `while`, it does not continue waiting.
6. Otherwise call `GetExitCodeProcess`, then close the process and thread handles.

**Blocking and cancellation**

The wait blocks the current Velox worker thread and does not pump messages or inspect flow cancellation. Calling `StopFlow` from another context does not make this function stop waiting. On timeout Velox raises but does not terminate the child; the external process can continue after the flow has handled or logged the exception.

Long-running calls can exhaust a limited service worker pool. Prefer asynchronous orchestration or a purpose-built action when an external operation commonly approaches the one-hour limit.

**Command and execution context**

Because `lpApplicationName=nil`, the executable token must be unambiguous and quoted when it contains spaces. Never concatenate untrusted values into a command line. The child inherits the parent environment and working directory, and the script wrapper always uses token zero, so a service run has the service account's filesystem/network rights and non-interactive session rather than the signed-in user's context.

**Errors and quirks**

- Creation failure returns `83569` without `GetLastError` details or automatic logging.
- The implementation ignores the return value from `GetExitCodeProcess`; if that call fails, the result can remain the previous sentinel.
- Wait results other than `WAIT_TIMEOUT` are not checked explicitly. A `WAIT_FAILED` path still calls `GetExitCodeProcess`.
- A timeout raises an exception containing the supplied command line. Secrets placed in arguments can therefore enter logs.
- Child exit codes are `DWORD`; do not assume they are signed Delphi `Integer` values.
- Database and file side effects in Velox or the child are not automatically coordinated into one transaction.

**Related entries**

- [`ExecCmdLine`](ExecCmdLine.md) returns after creation and cannot report an exit code.
- [`ExecShellCmdAndWait`](ExecShellCmdAndWait.md) resolves documents, URLs and associations through the Windows Shell instead.

**External references**

- [Microsoft Learn: `CreateProcessW`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw)
- [Microsoft Learn: `WaitForSingleObject`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject)
- [Microsoft Learn: `GetExitCodeProcess`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getexitcodeprocess)

<small>Created 2026-07-15</small>
