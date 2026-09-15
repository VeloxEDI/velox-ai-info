---
title: ErrorDir
description: Stores the raw error-routing directory template, including delimiter normalisation and simple FileDir-relative relocation.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, error-directory, configuration]
---

```Delphi
property ErrorDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.ErrorDir
  else
    Value := '';
end;
```

### Usage

`ErrorDir` stores the raw error-routing directory template, including delimiter normalisation and simple FileDir-relative relocation.

**Interaction with FileDir**

When [`FileDir`](FileDir.md) changes outside component reading/loading, Velox relocates ErrorDir only if its previous value case-insensitively equals:

- the old FileDir itself; or
- the old FileDir followed by `ERROR\`.

Unlike AuditDir, IssueDir and DuplicateDir, no date-suffixed ErrorDir forms are recognised. A custom or date-partitioned ErrorDir therefore remains attached to its existing path unless changed explicitly. Transfer and component loading bypass the relocation block.

**Runtime and persistence use**

[`ProcessErrorDir`](../Methods/ProcessErrorDir.md) expands the default directory and action/system tags. The one-shot error finaliser can run even when the shared log status is already false; it compares processed FileDir/ErrorDir, checks for the current file, creates the destination if needed, then uses unique-or-replace move behaviour.

Directory checking also attempts to create the processed directory. Add/save copies it into the `ERRORFILEPATH` operational database column, truncated to 255 characters. Neither action validates or changes the raw property.

### Additional Technical Info
`ErrorDir` stores the raw destination template for a file that must be moved through FileCon's error finaliser. Reading it returns configuration text, not the processed or verified directory.

A new FileCon defaults to `<DefaultDir>\ERROR\`. The native published property and script helper read/write the same backing string.

**Setter behaviour**

The setter applies Delphi `IncludeTrailingPathDelimiter` and nothing else. It does not resolve `<DefaultDir>`/tags, canonicalise the path, create the directory, test service-account access, move a file or persist a script assignment.

An empty assignment is not a safe clear: the Delphi-compatible routine returns a platform delimiter for empty input.

**Errors, security and quirks**

- Error routing can be skipped when processed FileDir and ErrorDir are exactly equal, but equivalent paths with different case/notation can compare unequal.
- Failed directory creation/movement is logged by the finaliser; the property setter itself is silent.
- Dynamic tags can change between calls or expose sensitive values in paths/logging.
- Relative traversal, mapped-drive and UNC behaviour follows the Velox process identity and Windows filesystem rules.
- The mutable FileCon is not synchronised for concurrent property writes and finalisation.

**Related entries**

- [`ProcessErrorDir`](../Methods/ProcessErrorDir.md) — resolves the current error path.
- [`DoMoveToError`](DoMoveToError.md) — one-shot error-move latch.
- [`FileDir`](FileDir.md) — controls simple standard-path relocation.
- [`CurrentFileName`](CurrentFileName.md) — source path used by finalisation.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — exact Delphi path helper used by the setter.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatibility reference, including empty input.

<small>Created 2026-07-15</small>
