---
title: ProcessTransportDir
description: Returns the configured await-transport directory after default-directory and action/system tag expansion.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, transport-directory, tags]
---

```Delphi
function ProcessTransportDir: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessTransportDir
  else
    Value := '';
end;
```

### Usage

`ProcessTransportDir` returns the configured await-transport directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Results can change on repeated evaluation; invalid/missing dynamic tags can raise.
- Expansion is not canonicalisation, root enforcement, access validation or delivery authorisation.
- Do not put credentials or untrusted transaction fragments in transport paths. Later move/log/transport steps can expose them.
- The Velox service identity and destination storage/retention controls apply during subsequent I/O.
- The stored setter normally adds a trailing delimiter; expansion does not guarantee one.

### Additional Technical Info
`ProcessTransportDir` resolves the FileCon's stored [`TransportDir`](../Properties/TransportDir.md) directory for files waiting to be transported.

**Implementation and use**

The method copies the stored transport-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then expands action-local and general system/global/setup/date/secret/constant tags. It does not process definition data-field tags.

Native move-to-transport logic uses this result when its routing latch is consumed. The method itself does not mark a file for transport, create/check the directory, move a file, enqueue a transport or prove later delivery.

Changing `FileDir` through its native setter always realigns the stored transport directory to `<new FileDir>\TRANSPORT\`; that side effect precedes and is separate from this processor.

**Performance and concurrency**

The call performs in-memory expansion only. Actual staging/movement is filesystem I/O and can race with transports; capture/use a result within one governed execution context.

**Related entries**

- [`ProcessFileDir`](ProcessFileDir.md) — primary directory.
- [`ProcessAuditDir`](ProcessAuditDir.md) and [`ProcessErrorDir`](ProcessErrorDir.md) — other routing destinations.
- [`TvxFileCon`](../../TvxFileCon.md) — transport flags/list and lifecycle.

<small>Created 2026-07-15</small>
