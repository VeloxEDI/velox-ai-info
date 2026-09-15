---
title: "WaitForFileLockRelease"
description: "Polls Velox's read/write lock probe once per second for the requested interval, then returns the final probe result."
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - lock
  - wait
  - polling
---

```Delphi
Function WaitForFileLockRelease( aFileName : string; aWaitFor : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Wait for at most 10 one-second polling intervals.
  Value := WaitForFileLockRelease('C:\Fictional\Inbound\order.xml', 10);
end;
```

### Usage

`WaitForFileLockRelease` polls Velox's read/write lock probe once per second for the requested interval, then returns the final probe result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFileName` | `string` | Literal path passed to the read/write/share-deny-write openability probe. |
| `aWaitFor` | `Integer` | Maximum one-second sleeps. The script declaration requires this argument. Exactly `-1` is converted to `30`; other values at or below zero perform no sleep. |

**Returns**

`True` when the final `FileLocked` call returns false; `False` when the final exact-mode probe still fails.

**Behaviour**

- `aWaitFor=10` can sleep about ten seconds, then performs an eleventh/final probe.
- The loop stops early when a condition probe succeeds, but the final probe can still fail if the state changes again.
- `aWaitFor=0` or another negative value except `-1` performs only the final probe.
- `aWaitFor=-1` means 30 intervals in Velox, even though that default is not optional in the published script signature.

**Errors**

Ordinary open failures are folded into waiting/`False`; no last-error detail is exposed. Unexpected runtime failures can propagate.

**Usage notes**

Use a bounded value and handle `False`. Then perform the real open/write with normal error handling. Do not use this helper as a lock acquisition or proof of exclusive ownership.

### Additional Technical Info
`WaitForFileLockRelease` repeatedly calls [`FileLocked`](FileLocked.md) and sleeps the executing thread for one second after each locked result, up to `aWaitFor` times. It then performs one final probe and returns whether that probe is openable.

The example is source-reviewed and was not executed by the documentation workflow. A real call can block its script thread.

**Implementation**

Velox sets a counter to zero. While `counter < aWaitFor` and `FileLocked(aFileName)` is true, it increments the counter and calls Win32 `Sleep(1000)`. After leaving the loop it evaluates `not FileLocked(aFileName)` again.

**Edge cases and quirks**

- “Locked” means the exact read/write open with only read sharing failed. Missing, read-only, inaccessible, directory and unavailable-network paths therefore wait just like sharing conflicts.
- A missing file can consume the full wait and still return `False`; this function does not wait for existence in a distinguishable way.
- Total elapsed time can exceed the nominal seconds because every probe and remote I/O adds latency.
- There is no cancellation, asynchronous yield, progress callback or configurable polling interval.
- Success is immediately racy; no handle is retained and another actor can lock/delete/replace the path before use.

**Side effects**

Temporarily opens/closes the file on successful probes and blocks the executing thread during sleeps. File content is not changed.

**Performance and concurrency**

Up to `aWaitFor + 1` synchronous open probes and `aWaitFor` one-second sleeps for positive values. This can tie up a worker/script thread and amplify remote-storage latency.

**Related entries**

- [`FileLocked`](FileLocked.md) defines the exact ambiguous probe.
- [`FileExists`](FileExists.md) can distinguish some missing-file cases but is still a snapshot.
- [`FileIsReadOnly`](FileIsReadOnly.md) checks the attribute independently.

**External references**

- [Embarcadero `System.SysUtils.FileOpen`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileOpen)
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) and [Microsoft `Sleep`](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-sleep) - exact Windows open and wait terminals.
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html) - compatible open API context; polling and sentinel rules are Velox-owned.

<small>Created 2026-07-15</small>
