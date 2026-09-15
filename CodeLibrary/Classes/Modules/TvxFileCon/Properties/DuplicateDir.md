---
title: DuplicateDir
description: Stores the raw duplicate-file directory template and follows recognised FileDir-relative date patterns when the primary directory changes.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, duplicate-directory, configuration]
---

```Delphi
property DuplicateDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.DuplicateDir
  else
    Value := '';
end;
```

### Usage

`DuplicateDir` stores the raw duplicate-file directory template and follows recognised FileDir-relative date patterns when the primary directory changes.

**Interaction with FileDir**

Outside component reading/loading, a changed [`FileDir`](FileDir.md) relocates DuplicateDir when the old value case-insensitively equals the old FileDir itself or one of these exact suffixes:

- `DUPLICATE\`;
- `DUPLICATE\<yyyy>-<mm>\`;
- `DUPLICATE\<yyyy>-<mm>-<dd>\`;
- `DUPLICATE\<yyyy><mm>\`; or
- `DUPLICATE\<yyyy><mm><dd>\`.

The suffix is rebuilt beneath the new FileDir. A custom DuplicateDir not matching those forms normally remains unchanged. Transfer bypasses all setters, while loading a FileCon with version below 300 forcibly derives `FileDir + 'DUPLICATE\'` and discards an older custom value.

**Runtime and persistence use**

The ordinary audit finaliser selects ProcessDuplicateDir when the log status is duplicate. Directory checking attempts to create the processed directory. Adding/saving a FileCon also copies the processed value into the `DUPFILEPATH` operational column, truncated to 255 characters; that snapshot is not validation and is not the raw template.

The finaliser can skip only when processed FileDir and DuplicateDir are exactly the same string. Otherwise, it creates the destination on demand and applies unique/replace movement rules.

### Additional Technical Info
`DuplicateDir` stores the raw destination template used when file processing has duplicate status. Reading it does not expand `<DefaultDir>` or any other tag; use [`ProcessDuplicateDir`](../Methods/ProcessDuplicateDir.md) for the current resolved string.

The default for a new FileCon is `<DefaultDir>\DUPLICATE\`. The value is published configuration and is copied directly when Velox creates/transfers a FileCon execution instance.

**Setter behaviour**

The native setter calls Delphi `IncludeTrailingPathDelimiter`. It adds a missing separator but performs no tag processing, existence/access check, path validation, directory creation, logging or configuration save.

Empty input is normalised to a platform delimiter by the Delphi-compatible routine. On Windows this can turn an attempted clear into a root-relative `\` value.

**Errors, security and quirks**

- The property can contain unresolved/dynamic tags; processing may raise or return a path that does not exist.
- Relative segments and untrusted tag values can redirect writes. Treat all path fragments as trusted configuration.
- Mapped drives and local paths are evaluated under the Velox process/service identity.
- Raw writes are unsynchronised and can race with processing or finalisation.

**Related entries**

- [`ProcessDuplicateDir`](../Methods/ProcessDuplicateDir.md) — resolves the current directory.
- [`FileDir`](FileDir.md) — controls standard-path relocation.
- [`AuditDir`](AuditDir.md) and [`IssueDir`](IssueDir.md) — other audit-status destinations.
- [`DoMoveToAudit`](DoMoveToAudit.md) — enables the shared audit finaliser.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — Delphi routine used by the setter.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible behaviour and the empty-input edge case.

<small>Created 2026-07-15</small>
