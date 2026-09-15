---
title: FIDS
description: Adapts the module FID to and from Delphi's canonical GUID string while retaining read-triggered identity creation and raising parse errors.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, fid, guid, string]
---

```Delphi
property FIDS: string read write;
```

### Example

```Delphi
function ModuleIdText(const Module: TvxDBCon): string;
begin
  Result := Module.FIDS;
end;
```

### Usage

`FIDS` adapts the module FID to and from Velox's canonical GUID string while retaining read-triggered identity creation and raising parse errors.

- Read it for logs, comparisons and interfaces only when creating an identity for a currently empty value is acceptable.
- Validate external text before assignment and treat configured module identity as immutable.
- Do not use the string setter to copy or rename a module; use the supported Velox configuration workflow.

### Additional Technical Info
`FIDS` is the string adapter for [`FID`](FID.md), normally producing the brace-delimited `'{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}'` form.

#### Source-backed behaviour

The getter calls `GUIDToString(FID)`. Because it goes through the `FID` getter, reading `FIDS` on a module whose stored identifier is empty first attempts to create and store a new GUID.

The setter calls `StringToGUID(Value)` and assigns the result through `FID`. Invalid syntax raises `EConvertError`; there is no local try/parse fallback. A syntactically valid identifier is accepted without checking whether it belongs to this module or collides with another configuration object.

Assignment changes the live object only and bypasses cache, relationship and database identity-management workflows. The value is not a friendly module name.

#### Official GUID references

- [Embarcadero: GUIDToString](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.GUIDToString)
- [Embarcadero: StringToGUID](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringToGUID)
- [Free Pascal: GUIDToString](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html)
- [Free Pascal: StringToGUID](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html)

<small>Created 2026-07-15</small>
