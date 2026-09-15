---
title: AuditDir
description: Stores the raw ordinary-audit directory template, with delimiter normalisation and conditional relocation when FileDir changes.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, audit-directory, configuration]
---

```Delphi
property AuditDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.AuditDir  { Raw template; no tags are expanded. }
  else
    Value := '';
end;
```

### Usage

`AuditDir` stores the raw ordinary-audit directory template, with delimiter normalisation and conditional relocation when FileDir changes.

**Interaction with FileDir**

Changing [`FileDir`](FileDir.md) outside component loading automatically relocates AuditDir only when its old value is one of these case-insensitive standard forms relative to the old FileDir:

- the old FileDir itself;
- `AUDIT\`;
- `AUDIT\<yyyy>-<mm>\`;
- `AUDIT\<yyyy>-<mm>-<dd>\`;
- `AUDIT\<yyyy><mm>\`; or
- `AUDIT\<yyyy><mm><dd>\`.

Velox preserves the matching suffix beneath the new FileDir. Any other custom AuditDir normally survives a FileDir change. Transfer and component loading bypass this relocation block.

### Additional Technical Info
`AuditDir` is the stored directory template used for ordinary file-audit outcomes. Reading it returns the raw configured text; use [`ProcessAuditDir`](../Methods/ProcessAuditDir.md) when the current resolved path is required.

The default for a new FileCon is `<DefaultDir>\AUDIT\`. The property is published native configuration, copied into execution instances by FileCon transfer and exposed to scripts through direct read/write helpers.

**Setter behaviour**

An assignment passes the supplied string through Delphi `IncludeTrailingPathDelimiter`. A missing final separator is appended and an existing separator is retained. The setter does not expand tags, canonicalise the path, check access, create a directory or save the module configuration.

Empty input is a dangerous special case: the underlying Delphi-compatible routine returns a platform path delimiter for an empty string. On Windows, do not expect `FileCon.AuditDir := ''` to leave the property blank.

**Runtime use**

Finalisation selects the processed audit directory for the ordinary audit branch. Issue and duplicate statuses use their dedicated directories instead. The move routine:

1. consumes the audit-move latch;
2. resolves FileDir and AuditDir;
3. skips the move only when the two processed strings are exactly equal;
4. creates the destination when needed; and
5. moves the current file using the configured unique/replace policy.

The raw property alone is therefore not proof that the directory exists, is reachable by the Velox service identity or received a file.

**Errors, security and quirks**

- Tag values are processed only by `ProcessAuditDir` and can change between calls.
- Case, relative segments, mapped drives, UNC aliases and trailing text are not canonicalised. Equivalent Windows paths can compare unequal.
- Untrusted or secret tag values can create path-traversal or disclosure risk in filenames and logs.
- Script writes mutate shared execution state without synchronisation. Avoid changing routing configuration while file finalisation may be using it.

**Related entries**

- [`ProcessAuditDir`](../Methods/ProcessAuditDir.md) — resolves default-directory and action/system tags.
- [`FileDir`](FileDir.md) — controls conditional relocation.
- [`DoMoveToAudit`](DoMoveToAudit.md) — one-shot finalisation latch.
- [`IssueDir`](IssueDir.md) and [`DuplicateDir`](DuplicateDir.md) — status-specific alternatives.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — Delphi delimiter normalisation used by the setter.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible behaviour, including the empty-input delimiter result.

<small>Created 2026-07-15</small>
