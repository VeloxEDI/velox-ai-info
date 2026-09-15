---
title: FileName
description: Stores the raw outbound save-name template that FileSavePath expands with counters, data and action tags before optional safety and uniqueness handling.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, filename-template, output]
---

```Delphi
property FileName: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.FileName  { Inspecting this raw value is not stateful. }
  else
    Value := '';
end;
```

### Usage

`FileName` stores the raw outbound save-name template that FileSavePath expands with counters, data and action tags before optional safety and uniqueness handling.

**Processing sequence**

Reading [`FileSavePath`](FileSavePath.md) performs the actual stateful construction:

1. advance the local counter or attempt the enabled shared database counter;
2. resolve [`FileDir`](FileDir.md);
3. pass this FileName through [`ProcessFileName`](../Methods/ProcessFileName.md);
4. optionally choose a unique full path; and
5. assign the result to [`CurrentFileName`](CurrentFileName.md).

`ProcessFileName`, in turn, processes `<FILENO>`, `<COUNTER>`, definition data-field tags when available, then action-local/general tags, and finally optional safe-filename conversion. `<FILENO>` is consumed only when present; the save counter advances before processing even when no `<COUNTER>` tag exists.

### Additional Technical Info
`FileName` stores the raw template used when FileCon constructs a path for a file it is about to save. It is distinct from [`FilePattern`](FilePattern.md), which is primarily an inbound/discovery wildcard.

The default is an empty string. The getter and setter access the backing field directly: they do not process tags, increment counters, enforce a basename, make the text safe/unique, update CurrentFileName, perform I/O or save the configured module.

**Empty and path-containing values**

An empty FileName is accepted. FileSavePath can then return the processed directory itself while still advancing counter state and setting CurrentFileName. That is not a valid guarantee of a writable file target.

The direct setter does not reject separators, rooted text, relative traversal, wildcard characters, reserved device names or a name that resolves blank. Optional safe-name conversion applies only during ProcessFileName and is not a substitute for an authorised containment policy. Review generated paths before effectful use.

**Errors and state**

- FileSavePath catches processing exceptions, logs an error and returns an empty string, but counter side effects may already have occurred.
- Tags are evaluated from live mutable context and may differ for each call.
- Unique naming is a check-then-select operation; concurrent writers can still race.
- FileName assignment is unsynchronised. Changing it while another action reads FileSavePath can produce inconsistent results.

**Related entries**

- [`FileSavePath`](FileSavePath.md) — stateful full-path generator.
- [`ProcessFileName`](../Methods/ProcessFileName.md) — exact tag and safety order.
- [`FileDir`](FileDir.md) — processed prefix.
- [`FilePattern`](FilePattern.md) and [`FileSaveName`](FileSaveName.md) — separate wildcard-derived name path.
- [`FileNo`](FileNo.md) — state consumed by `<FILENO>`.

<small>Created 2026-07-15</small>
