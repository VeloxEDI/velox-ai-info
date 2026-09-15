---
title: ProcessFileDir
description: Returns the primary file directory after default-directory and action/system tag expansion.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, file-directory, tags]
---

```Delphi
function ProcessFileDir: String;
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

`ProcessFileDir` returns the primary file directory after default-directory and action/system tag expansion.

**Errors, security and quirks**

- Results can vary across calls as locals/globals/time/setup/secret context changes. Evaluate once for a single operation when consistency matters.
- Invalid/missing dynamic tags can raise; no fallback to the raw path is provided here.
- Expansion does not canonicalise, enforce a root, verify existence/access or protect against untrusted traversal fragments.
- The Velox service/process identity must be able to access the later path; interactive mapped drives are particularly context-dependent.
- The stored setter normally adds a trailing delimiter and can automatically realign several default child directories. This processor neither performs those setter side effects nor re-adds a delimiter after expansion.

### Additional Technical Info
`ProcessFileDir` resolves the primary [`FileDir`](../Properties/FileDir.md) template used by FileCon discovery and output-path construction.

**Implementation**

The method copies the stored primary-directory string, replaces `<DEFAULTDIR>` case-insensitively with the setup default file path captured at module initialisation, then processes action-local and general system/global/setup/date/secret/constant tags. It does not process data-field tags.

It returns text only. Directory creation/checking, file-pattern search, lock waiting and actual read/write operations occur in other native paths. The same processed value is also used for routing equality comparisons and some configuration/monitor metadata.

**Performance and concurrency**

No filesystem I/O occurs, but general/secret tag resolution can add cost and produce sensitive text. The FileCon context is mutable and unsynchronised.

**Related entries**

- [`ProcessFileName`](ProcessFileName.md) — filename/data/counter processing.
- [`MatchesSearchPattern`](MatchesSearchPattern.md) — basename pattern test used alongside this directory.
- [`ProcessAuditDir`](ProcessAuditDir.md) and [`ProcessErrorDir`](ProcessErrorDir.md) — routed destinations.
- [`TvxFileCon`](../../TvxFileCon.md) — complete state and I/O boundary.

<small>Created 2026-07-15</small>
