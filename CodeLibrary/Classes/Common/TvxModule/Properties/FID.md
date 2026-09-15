---
title: FID
description: Gets or sets the module GUID, with a read of an empty value creating and storing a new identifier as a side effect.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, fid, guid, identity]
---

```Delphi
property FID: TGuid read write;
```

### Example

```Delphi
function ModuleId(const Module: TvxDBCon): TGuid;
begin
  Result := Module.FID;
end;
```

### Usage

`FID` gets or sets the module GUID, with a read of an empty value creating and storing a new identifier as a side effect.

- Treat FID as immutable for loaded/configured modules. Write only to a deliberately transient object in a documented Velox workflow.
- Do not read it merely to test whether identity exists when creating an identifier would be undesirable; the script surface exposes no non-mutating empty check for this property.
- Prefer [`FIDS`](FIDS.md) for logging or serialisation, remembering that reading either property can create an identifier.

### Additional Technical Info
`FID` is the module's Velox identifier as a `TGuid`. It is mutable, and its getter is not side-effect free.

#### Source-backed behaviour

Both getter and setter enter the module's monitor lock. On read, if the stored `FFID` is the empty GUID, Velox calls Delphi `CreateGUID(FFID)` and then returns the stored value. The HRESULT from `CreateGUID` is ignored. Thus inspecting a new/transient module can assign it a new identity; the matching [`FIDS`](FIDS.md) getter does the same indirectly.

The setter replaces `FFID` directly, including with an empty or another module's GUID. It does not update caches, database rows, relationships, folder data or other loaded references. Native Velox has managed identity-switch paths for some workflows, but this script helper bypasses them.

Reading an already populated value and direct writes are locked, but related module fields and multi-step identity workflows are not made atomic by that lock.

#### Operational guidance

- Treat FID as immutable for loaded/configured modules. Write only to a deliberately transient object in a documented native workflow.
- Do not read it merely to test whether identity exists when creating an identifier would be undesirable; the script surface exposes no non-mutating empty check for this property.
- Prefer [`FIDS`](FIDS.md) for logging/serialisation, while retaining the same lazy-creation warning.

#### Official GUID references

- [Embarcadero: CreateGUID](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.CreateGUID)
- [Free Pascal: CreateGUID](https://www.freepascal.org/docs-html/rtl/sysutils/createguid.html)
- [Free Pascal: TGuid](https://www.freepascal.org/docs-html/current/rtl/system/tguid.html)

<small>Created 2026-07-15</small>
