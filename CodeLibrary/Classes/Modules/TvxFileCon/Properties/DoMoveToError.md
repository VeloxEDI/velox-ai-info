---
title: DoMoveToError
description: Gets or sets the one-shot runtime latch for moving the current file to the configured error directory.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, error-routing, routing-latch]
---

```Delphi
property DoMoveToError: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.DoMoveToError
  else
    Value := False;
end;
```

### Usage

`DoMoveToError` gets or sets the one-shot runtime latch for moving the current file to the configured error directory.

**Consumer behaviour**

Velox move-to-error requires a nonempty current path and true latch, then clears the latch before processed-path equality, existence, destination, lock and move checks. Unlike audit/transport routing, it is designed to run when the shared log is already false. A missing source is silently ignored to avoid a second error after a failed write.

The consumer may create the destination, wait for the file lock, move with cross-volume/unique-or-replace policy and update a log-file event when a log reference exists. The latch says none of those outcomes occurred.

### Additional Technical Info
`DoMoveToError` is the runtime latch checked when failure finalisation may route `CurrentFileName` to ErrorDir.

Reset sets it `True` so an error normally attempts cleanup/routing. File engines can clear it when no physical output file was created. The scripting setter directly changes the Boolean and performs no I/O.

**Risks and interactions**

- Setting false can leave a failed input/output in its current location; setting true can move an unrelated/stale path.
- Consumption is one-shot even if the source is missing or the move fails.
- It is independent of audit/transport latches; conflicting script assignments can create multiple finalisation attempts.
- Routing is an external filesystem effect and is not undone by database/action rollback.
- Assignment does not persist configuration or itself change Log.Status/FileEvent.

**Performance and concurrency**

Access is cheap; later routing can block. Treat the latch and current path as one action-thread state machine.

**Related entries**

- [`DoMoveToAudit`](DoMoveToAudit.md), [`DoMoveToTransport`](DoMoveToTransport.md) and [`CurrentFileName`](CurrentFileName.md).
- [`ProcessErrorDir`](../Methods/ProcessErrorDir.md) — destination string processing.

<small>Created 2026-07-15</small>
