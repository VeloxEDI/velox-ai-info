---
title: FolderFID
description: Gets or sets the raw GUID of the module's configuration folder without resolving or synchronising the cached folder name.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, folder, fid, guid]
---

```Delphi
property FolderFID: TGuid read write;
```

### Example

```Delphi
procedure CopyFolderId(const Source, Target: TvxDBCon);
begin
  Target.FolderFID := Source.FolderFID;
  { FolderName is independent and is not changed by this assignment. }
end;
```

### Usage

`FolderFID` gets or sets the raw GUID of the module's configuration folder without resolving or synchronising the cached folder name.

- Treat folder placement as a governed configuration operation, not a pair of casual property assignments.
- Do not assign an arbitrary or customer-supplied GUID; validate the target folder and use the supported Velox move workflow.
- Use [`FolderFIDS`](FolderFIDS.md) for textual interchange, with the same persistence and synchronisation limits.

### Additional Technical Info
`FolderFID` is the module's parent-folder identifier as a `TGuid`.

#### Source-backed behaviour

The getter and setter directly read/write `FFolderFID`. Unlike [`FID`](FID.md), reading an empty value does not create a GUID and no monitor lock is used.

Native module load fills both this field and [`FolderName`](FolderName.md) from a database query. Script assignment updates only the GUID. It does not verify that the folder exists, move the module in navigation, refresh `FolderName`, update the database or update relation rows.

This separation matters because native relationship saving can reuse a non-empty cached folder name. Changing only the GUID while leaving an old non-empty name can produce inconsistent live metadata and, if a later native save occurs, inconsistent relationship descriptions.

#### Official type reference

- [Embarcadero: TGUID](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TGUID)
- [Free Pascal: TGuid](https://www.freepascal.org/docs-html/current/rtl/system/tguid.html)

<small>Created 2026-07-15</small>
