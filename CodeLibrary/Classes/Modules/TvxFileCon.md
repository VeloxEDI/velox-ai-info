---
title: TvxFileCon
description: Represents Velox file-location configuration together with mutable per-execution file state and routing controls.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - file-connection
  - file-processing
---

```Delphi
TvxFileCon = class(TvxModule)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ProcessFileDir
  else
    Value := '';
end;
```

### Usage

`TvxFileCon` represents Velox file-location configuration together with mutable per-execution file state and routing controls.

**Acquisition and ownership**

The scripting surface does not register a constructor. Obtain a Velox-owned instance from the current [`FileCon`](../../Variables/Modules/FileCon.md) context or a data definition. Do not free, replace or retain it beyond the owning action/definition lifetime.

The object is not a passive path record. It holds the current filename/path, deprecated in-memory file data and hash, file-number/counter state, move-routing flags, action locals, log-file references and a transport-file list. Its methods range from string-only processing to filesystem mutation.

### Additional Technical Info
`TvxFileCon` is the script-visible Velox module that combines persisted file location/naming configuration with the live state used while discovering, reading, writing, copying, moving and routing files.

**Path, name and pattern processing**

- Directory processors replace `<DEFAULTDIR>` with the setup default path captured when the module is initialised, then expand action-local and system/global/setup/date/secret/constant tags. They do not process data-field tags or check the filesystem.
- [`ProcessFileName`](TvxFileCon/Methods/ProcessFileName.md) additionally handles the stateful `<FILENO>` and `<COUNTER>` tags, definition data tags at the current output-record position and optional safe-filename conversion.
- [`MatchesSearchPattern`](TvxFileCon/Methods/MatchesSearchPattern.md) compares a basename against the processed stored pattern with the custom `*`/`?` matcher.
- Native `ProcessFilePattern` is registered at runtime but omitted from compile-time registration. Normal scripts cannot call it even though native FileCon logic and `MatchesSearchPattern` use it internally.

**Reset and lifetime quirks**

Reset clears the new/explicit/current paths, locals/log reference, file event and routing flags; resets `FileNo` to 1 and the hidden data-record position to 0; and disposes the cached counter query. It defaults move-to-error true and move-to-audit/transport false.

Reset does not itself clear the deprecated `FileData`, `FileHash` or `TransportFiles` collection. Some owning actions explicitly clear transport files before use, but scripts must not assume every reuse path starts with those values empty. Likewise, the separate counter has flow/service/database-specific management and is not reset by simply processing a name.

**Security, errors and side effects**

- All filesystem operations run with the Velox process/service identity and can expose, overwrite, move or delete access to business data. A path value is not authorisation.
- Tags can disclose locals, transaction data or secrets into names, paths and logs. Do not embed credentials or untrusted path fragments.
- Writable properties change live object state and usually do not persist module configuration by themselves.
- File operations report mainly through the shared Log/Status and can leave partial external effects that database rollback cannot undo.
- A loaded instance is mutable and unsynchronised. Concurrent access can race current filename, flags, counters, lists and tag context.

**Related entries**

- [`ProcessFileDir`](TvxFileCon/Methods/ProcessFileDir.md) and [`ProcessFileName`](TvxFileCon/Methods/ProcessFileName.md) — primary directory/name resolution.
- [`ProcessAuditDir`](TvxFileCon/Methods/ProcessAuditDir.md), [`ProcessIssueDir`](TvxFileCon/Methods/ProcessIssueDir.md), [`ProcessDuplicateDir`](TvxFileCon/Methods/ProcessDuplicateDir.md), [`ProcessErrorDir`](TvxFileCon/Methods/ProcessErrorDir.md), [`ProcessTransportDir`](TvxFileCon/Methods/ProcessTransportDir.md) and [`ProcessTempDir`](TvxFileCon/Methods/ProcessTempDir.md) — routed directories.
- [`FileCon`](../../Variables/Modules/FileCon.md) — current scripting context accessor.

<small>Created 2026-07-15</small>
