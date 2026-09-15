---
title: DoMoveToTransport
description: Gets or sets the one-shot latch for staging the current file in the await-transport directory.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, transport, staging, routing-latch]
---

```Delphi
property DoMoveToTransport: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.DoMoveToTransport
  else
    Value := False;
end;
```

### Usage

`DoMoveToTransport` gets or sets the one-shot latch for staging the current file in the await-transport directory.

**Consumer behaviour**

The Velox staging move requires a current path and true latch, then clears the latch before checking successful log status, path equality, existence, destination creation, lock and move. It can create the transport directory and move with cross-volume/unique-or-replace policy.

On a physical move success it updates the transport log-file event. If no log file exists, the access error is caught/logged **after the file may already have moved**, producing a false status/partial-success state.

### Additional Technical Info
`DoMoveToTransport` is the runtime latch for moving a monitored/read file out of the primary directory while it awaits outbound transport.

Setting true directly stores the value and also clears `DoMoveToAudit`; setting false does not restore audit. Reset sets it false.

**Important distinctions and risks**

- This latch stages a file; it does not register [`TransportFiles`](TransportFiles.md), create/send a transport event or prove delivery.
- Consumption is one-shot even when no move occurs.
- Scripts can re-enable audit afterward, creating conflicting route attempts.
- Forcing staging can remove a monitored file from its input directory; suppressing it can leave a file exposed to reprocessing.
- Filesystem movement/logging are external effects and not transactional.

**Performance and concurrency**

Property access is constant-time; the eventual lock/move can block. Do not mutate route flags/current file concurrently with finalisation/transport actions.

**Related entries**

- [`DoMoveToAudit`](DoMoveToAudit.md), [`DoMoveToError`](DoMoveToError.md) and [`CurrentFileName`](CurrentFileName.md).
- [`ProcessTransportDir`](../Methods/ProcessTransportDir.md) — staging destination.
- [`RecordFileForTransport`](../Methods/RecordFileForTransport.md) — separate outbound registration.

<small>Created 2026-07-15</small>
