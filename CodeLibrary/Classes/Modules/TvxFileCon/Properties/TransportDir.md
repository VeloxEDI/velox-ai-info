---
title: TransportDir
description: Stores the raw await-transport directory template, which a qualifying FileDir change replaces even when it was custom.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, transport-directory, configuration]
---

```Delphi
property TransportDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.TransportDir
  else
    Value := '';
end;
```

### Usage

`TransportDir` stores the raw await-transport directory template, which a qualifying FileDir change replaces even when it was custom.

**Errors, security and quirks**

- The property setter is silent; finalisation logs creation/move failures.
- A nil log-file reference can cause the transport-event update to fail after the physical move has already succeeded.
- Dynamic/untrusted path tags can redirect staging or expose information in logs.
- Mapped-drive/UNC/local access is evaluated for the Velox service/process identity.
- Exact string equality is not Windows path equivalence.
- Property writes are unsynchronised with finalisation.

### Additional Technical Info
`TransportDir` stores the raw staging-directory template for a file that must await a configured transport. It is not a remote destination or proof that transport occurred.

The new-configuration default is `<DefaultDir>\TRANSPORT\`. Reading returns the unprocessed value; [`ProcessTransportDir`](../Methods/ProcessTransportDir.md) resolves the default-directory and action/system tags.

**Setter and FileDir interaction**

The direct setter applies Delphi `IncludeTrailingPathDelimiter`. It does not expand/validate the path, create a folder, move/queue/send a file or persist the runtime assignment. Empty input is normalised to a platform delimiter.

When [`FileDir`](FileDir.md) changes outside component reading/loading and its old raw value is not exactly the supplied value, FileDir unconditionally replaces TransportDir with the new base plus `TRANSPORT\`. Unlike the other status directories, no “is this still a standard path?” preservation test occurs. Therefore:

- assign FileDir first and a custom TransportDir second;
- any later qualifying FileDir change discards that custom value; and
- a same-raw-value FileDir assignment does not run this TransportDir cascade, although it still replaces TempDir.

The current File Connection setup form does not expose TransportDir and the native setter intentionally derives it from FileDir. Component loading suppresses this normal cascade, but loading a FileCon with version below 300 subsequently forces the same derived value. Transfer copies TransportDir directly without setter behaviour.

**Runtime use**

When [`DoMoveToTransport`](DoMoveToTransport.md) is consumed, finalisation:

1. resolves FileDir and TransportDir;
2. skips if the processed strings are exactly equal;
3. checks that CurrentFileName exists;
4. creates TransportDir on demand;
5. moves the file with unique-or-replace behaviour; and
6. updates the log-file transport event.

The general directory-check operation deliberately does not create TransportDir, so unused FileCons do not show an unnecessary transport folder. The folder is created only if movement needs it.

This staging move is separate from [`RecordFileForTransport`](../Methods/RecordFileForTransport.md), which records current paths/log objects for a later transport action.

**Related entries**

- [`ProcessTransportDir`](../Methods/ProcessTransportDir.md) — resolves the current staging path.
- [`FileDir`](FileDir.md) — normally re-derives this property.
- [`DoMoveToTransport`](DoMoveToTransport.md) — one-shot staging latch.
- [`TransportFiles`](TransportFiles.md) — separate mutable recorded-file list.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — Delphi path helper used by the setter.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible delimiter behaviour and empty-input edge case.

<small>Created 2026-07-15</small>
