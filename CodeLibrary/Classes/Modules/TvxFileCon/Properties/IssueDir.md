---
title: IssueDir
description: Stores the raw issue-status directory template and relocates recognised FileDir-relative date layouts with the primary path.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, issue-directory, configuration]
---

```Delphi
property IssueDir: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if FileCon <> nil then
    Value := FileCon.IssueDir
  else
    Value := '';
end;
```

### Usage

`IssueDir` stores the raw issue-status directory template and relocates recognised FileDir-relative date layouts with the primary path.

**Interaction with FileDir**

Outside component reading/loading, a changed [`FileDir`](FileDir.md) relocates IssueDir when the old raw value case-insensitively matches the old base directory or one of these exact suffixes:

- `ISSUE\`;
- `ISSUE\<yyyy>-<mm>\`;
- `ISSUE\<yyyy>-<mm>-<dd>\`;
- `ISSUE\<yyyy><mm>\`; or
- `ISSUE\<yyyy><mm><dd>\`.

Velox rebuilds the recognised layout under the new FileDir. Other custom paths normally remain unchanged. FileCon transfer bypasses the setter. For configurations with version below 300, the Loaded compatibility step forcibly replaces IssueDir with `FileDir + 'ISSUE\'`.

**Runtime and persistence use**

[`ProcessIssueDir`](../Methods/ProcessIssueDir.md) replaces the default-directory token and resolves action/system tags. The audit finaliser selects it for issue status, creates it if needed and moves the current file under unique-or-replace rules. It skips only when the processed source and issue strings are exactly equal.

Directory checking attempts to create the processed IssueDir. FileCon add/save also stores a processed, 255-character-truncated snapshot in `ISSUEFILEPATH`. Neither operation rewrites the raw property.

### Additional Technical Info
`IssueDir` stores the raw destination template used by audit finalisation when the active log status is issue. Reading it returns configuration text without expanding any tag.

The new-configuration default is `<DefaultDir>\ISSUE\`. The native published field is copied directly during FileCon transfer and exposed through script read/write helpers.

**Setter behaviour**

The setter calls Delphi `IncludeTrailingPathDelimiter`. It adds a missing final separator, but it does not resolve tags, validate/canonicalise the path, create a directory, check the service identity's access or persist a script assignment.

Empty input is normalised to the platform delimiter by the Delphi-compatible helper. Treat an empty assignment as unsafe rather than as a supported clear.

**Errors, security and concurrency**

- Setter success says nothing about existence, permissions or future tag resolution.
- Relative segments, dynamic/untrusted tags and mapped drives can redirect or break service-side file routing.
- Equivalent paths with different case/alias/notation can compare unequal.
- Processed paths can expose sensitive tag values in logs or operational database fields.
- Reads/writes and finalisation are unsynchronised on a shared FileCon.

**Related entries**

- [`ProcessIssueDir`](../Methods/ProcessIssueDir.md) — resolves the current path.
- [`FileDir`](FileDir.md) — relocation controller.
- [`DoMoveToAudit`](DoMoveToAudit.md) — shared audit-move latch.
- [`AuditDir`](AuditDir.md) and [`DuplicateDir`](DuplicateDir.md) — other status destinations.

**External references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — Delphi setter terminal.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible behaviour and empty-input result.

<small>Created 2026-07-15</small>
