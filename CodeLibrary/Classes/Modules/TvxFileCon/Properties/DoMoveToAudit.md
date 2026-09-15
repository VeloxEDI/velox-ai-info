---
title: DoMoveToAudit
description: Gets or sets the one-shot runtime latch for routing the current file to its audit, issue or duplicate directory.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, audit, routing-latch]
---

```Delphi
property DoMoveToAudit: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.DoMoveToAudit
  else
    Value := False;
end;
```

### Usage

`DoMoveToAudit` gets or sets the one-shot runtime latch for routing the current file to its audit, issue or duplicate directory.

**Consumer behaviour**

The Velox move-to-audit method requires a nonempty current path and a true latch. It then clears the latch **before** checking log success, processed path equality, file existence, destination creation, lock release or move success. The attempt is therefore one-shot even when no move occurs.

Ordinary OK/warning-style status routes to AuditDir; issue/duplicate status selects their dedicated directories. Missing files warn; errors are logged. The latch alone does not prove any file was processed/audited or that a log event was updated.

### Additional Technical Info
`DoMoveToAudit` is the runtime latch checked when FileCon finalisation decides whether to move `CurrentFileName` to an outcome directory.

The direct setter stores the Boolean without moving or validating anything. Reset sets it false; file-read engines normally set it true after selecting a file.

**Interactions and risks**

- Setting `DoMoveToTransport := True` clears this latch. Setting transport false does not restore it.
- `MoveFile` clears it after every attempted explicit move, including failed attempts.
- Scripts can set audit true after transport true and create conflicting latches. Native action finalisation may then attempt sequential routing against stale current-path state.
- Suppressing or forcing audit changes replay, retention and compliance behaviour and cannot roll back earlier effects.
- Assignment is live state only and does not persist FileCon configuration.

**Performance and concurrency**

Access is constant-time; the later consumer can block on filesystem/lock/network work. Do not race the latch against engines/finalisation.

**Related entries**

- [`DoMoveToTransport`](DoMoveToTransport.md) and [`DoMoveToError`](DoMoveToError.md) — other routing latches.
- [`CurrentFileName`](CurrentFileName.md) and [`ProcessAuditDir`](../Methods/ProcessAuditDir.md) — source/destination context.

<small>Created 2026-07-15</small>
