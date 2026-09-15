---
title: FolderFIDS
description: Adapts the raw folder GUID to and from Delphi's canonical GUID string without resolving folder existence or its cached name.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, folder, guid, string]
---

```Delphi
property FolderFIDS: string read write;
```

### Example

```Delphi
function FolderIdText(const Module: TvxDBCon): string;
begin
  Result := Module.FolderFIDS;
end;
```

### Usage

`FolderFIDS` adapts the raw folder GUID to and from Velox's canonical GUID string without resolving folder existence or its cached name.

### Additional Technical Info
`FolderFIDS` is the string adapter for [`FolderFID`](FolderFID.md), normally using the brace-delimited GUID representation.

#### Source-backed behaviour

The getter returns `GUIDToString(FolderFID)`. It does not lazily create an identifier, so an unassigned folder returns the canonical empty-GUID string.

The setter calls `StringToGUID(Value)` and assigns the result to `FolderFID`. Invalid syntax, including an arbitrary name in place of a GUID, raises `EConvertError`. No existence, ownership or permission check occurs. The matching [`FolderName`](FolderName.md) cache is not changed.

Assignment is live-object state only. It does not move or save the module, and a later save can carry forward stale folder-name metadata if callers changed only this property.

#### Official GUID references

- [Embarcadero: GUIDToString](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.GUIDToString)
- [Embarcadero: StringToGUID](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringToGUID)
- [Free Pascal: GUIDToString](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)
- [Free Pascal: StringToGUID](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html)

<small>Created 2026-07-15</small>
