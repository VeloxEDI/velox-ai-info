---
title: GetCurrentRecord
description: Copies the current record into a caller-supplied native record buffer; the exposed PChar binding is unsafe for normal scripts.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, getcurrentrecord, raw-buffer, unsafe]
---

```Delphi
function GetCurrentRecord(Buffer: PChar): Boolean;
```

### Example

```Delphi
procedure ReadCurrentSafely(const Data: TvxClientDataSet; var Code: string);
begin
  // Use typed fields; do not pass a script String as a native record buffer.
  Code := Data.FieldByName('Code').AsString;
end;
```

### Usage

`GetCurrentRecord` copies the current record into a caller-supplied Velox record buffer; the exposed PChar binding is unsafe for normal scripts.

- Do not call from ordinary Velox scripts. Use [`Fields`](../Properties/Fields.md), [`FieldByName`](FieldByName.md) or higher-level export APIs.
- A false result only means no current record/copy; it does not make an invalid buffer safe.
- Never treat output as null-terminated text.

### Additional Technical Info
`GetCurrentRecord` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). This is a binary internal-buffer API, not a text serialization function.

#### Source-backed behaviour

The importer declares `PChar`, but the current Delphi terminal accepts `TRecBuf`/`TRecordBuffer` and descendants write their private native record layout into that address. `TCustomClientDataSet` succeeds only for a nonempty current buffer flagged current, updates cursor position, then asks its DS cursor to copy the native record.

The required allocation size/layout includes descendant data, record metadata and bookmarks. The script surface exposes no safe typed allocation/decoder contract for it, and a Delphi String/PChar is not a valid substitute. An undersized or immutable buffer risks memory corruption, access violations and process instability.

#### Related members

[`Fields`](../Properties/Fields.md) provides typed current-record access. [`IsEmpty`](IsEmpty.md) checks whether a current record exists.

#### Official RTL references

- [Embarcadero: TDataSet.GetCurrentRecord](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.GetCurrentRecord)
- [Free Pascal: TDataSet.GetCurrentRecord](https://www.freepascal.org/docs-html/fcl/db/tdataset.getcurrentrecord.html)

<small>Created 2026-07-15</small>
