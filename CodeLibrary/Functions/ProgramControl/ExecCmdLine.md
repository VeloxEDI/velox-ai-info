---
title: "ExecCmdLine"
description: "Starts a hidden Windows process from one CreateProcess command line and returns immediately with the creation result."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - program-control
  - process
  - windows
  - security
---

```Delphi
function ExecCmdLine(const CmdLine: string): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if not ExecCmdLine('"C:\Tools\Importer.exe" --input "C:\Data\orders.json"') then
    raise Exception.Create('Windows could not create the importer process');

  Value := 'Importer started';
end;
```

### Usage

`ExecCmdLine` starts a hidden Windows process from one CreateProcess command line and returns immediately with the creation result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `CmdLine` | `string` | Complete executable-and-arguments command line. Quote the executable path and each argument according to the target program's Windows command-line parser. |

**Returns**

Returns the Boolean result from Windows `CreateProcessW`: `True` means a process was created; `False` means process creation failed. `True` does not mean that the child completed, accepted its input or performed useful work.

No Windows error code or message is exposed by this function. If the caller needs completion status, use [`ExecCmdLineAndWait`](ExecCmdLineAndWait.md), while accounting for that function's sentinel and timeout behaviour.

### Additional Technical Info
`ExecCmdLine` asks Windows to create a process from one complete command-line string and returns as soon as creation succeeds or fails. It neither waits for the child nor reports its eventual exit code. The Velox wrapper requests a hidden initial window and always starts the child in the identity and session of the current Designer or service process.

This function crosses an operating-system security boundary. Build `CmdLine` only from trusted, validated executable paths and arguments; do not concatenate untrusted mapping data into a command. The example is fictional and source-reviewed only. It does not execute a process as part of documentation validation.

**Implementation**

Velox calls its process helper with `WindowState=SW_HIDE` and `hToken=0`. The helper initialises `STARTUPINFO`, requests `STARTF_USESHOWWINDOW`, and calls `CreateProcessW` with:

- `lpApplicationName=nil` and the complete caller string in `lpCommandLine`;
- no inherited handles;
- `CREATE_NEW_CONSOLE or NORMAL_PRIORITY_CLASS`;
- inherited environment variables and current directory; and
- the current process security token because the script API never supplies a user token.

It then closes the returned process and primary-thread handles; closing them does not terminate the child.

**Command-line parsing and security**

With `lpApplicationName=nil`, Windows derives the executable from the first whitespace-delimited portion of the command line. An executable path containing spaces must be quoted. Ambiguous unquoted paths can cause Windows to search for and start a different executable, which is both a correctness and security risk.

Argument parsing after process creation belongs to the child program and is not standardised across all Windows applications. Quote and escape arguments for that specific program. Shell metacharacters are not interpreted unless the selected executable is itself a command processor such as `cmd.exe` or PowerShell.

The service build normally runs under a service account and in a non-interactive session. Mapped drives, user profiles, credentials, environment variables, network access and UI behaviour can therefore differ from an interactive Designer run.

**Errors and implementation defect**

On creation failure the native helper returns `False`, but its local `PROCESS_INFORMATION` record was not initialised. It nevertheless calls `CloseHandle` on both record fields unconditionally. Those fields can contain indeterminate values. `CloseHandle` failures are ignored, so the script normally still receives `False`, but the behaviour is an implementation defect and could attempt to close unrelated invalid values.

The wrapper does not call `GetLastError`, log the failed command or return diagnostic details. Add suitable Velox logging around the result, but avoid logging secrets embedded in arguments.

**Concurrency and lifecycle**

The child runs independently after the function returns. Velox does not retain its process handle, cancel it when the flow stops or coordinate it with flow transactions. Parallel records or flows can start multiple copies concurrently. Implement idempotency, locking and bounded concurrency in the invoked tool or surrounding flow when duplication would be unsafe.

**External references**

- [Microsoft Learn: `CreateProcessW`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw)

<small>Created 2026-07-15</small>
