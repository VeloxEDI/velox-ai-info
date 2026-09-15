---
title: CurrentFileName
description: Gets or sets the raw full path that FileCon operations currently treat as the active file.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, current-file, path]
---

```Delphi
property CurrentFileName: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.CurrentFileName
  else
    Value := '';
end;
```

### Usage

`CurrentFileName` gets or sets the raw full path that FileCon operations currently treat as the active file.

### Additional Technical Info
`CurrentFileName` is FileCon's mutable active-file path. Native engines, discovery, save generation, routing and transports use it to identify the file currently being handled.

Reset sets it to empty. The scripting helper directly reads/writes the backing field with no validation, tag processing, path normalisation, existence/lock/access check or log event.

**Native state interactions**

- Assigning [`FilePath`](FilePath.md) also assigns CurrentFileName, but assigning CurrentFileName does not populate the one-shot explicit FilePath field.
- Reading FilePath or generating FileSavePath assigns the result here.
- `CopyFile` uses it as source but leaves it unchanged.
- `MoveFile` assigns its chosen destination and disables audit after the attempt, even when the physical move failed.
- Outbound transport creation iterates TransportFiles and assigns each queued path here before creating transport events.

**Safety and quirks**

A nonempty value is not evidence that the path exists, is the path actually produced by a unique copy, passed lock checks, was written successfully or remains current. In particular, `CopyFileFrom` can store a failed/pre-unique destination and `MoveFile` can store a failed destination.

Writing the property can redirect later copy/move/transport/audit/error operations to any path accessible to the Velox service identity. Treat it as effectful control state, use trusted roots and never feed it untrusted transaction text.

**Performance and concurrency**

Raw access is constant-time; consumers can perform blocking filesystem/network work. The field is unsynchronised and must not be shared across concurrent file operations.

**Related entries**

- [`FilePath`](FilePath.md) — destructive explicit/discovery getter that sets this property.
- [`CopyFile`](../Methods/CopyFile.md), [`CopyFileFrom`](../Methods/CopyFileFrom.md) and [`MoveFile`](../Methods/MoveFile.md) — exact state effects.
- [`TransportFiles`](TransportFiles.md) — queued paths assigned here during transport creation.

<small>Created 2026-07-15</small>
