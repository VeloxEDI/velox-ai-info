---
title: ftFmtMemo
description: Identifies a legacy formatted-text memo whose bytes and formatting grammar remain defined by the originating provider.
sidebar_position: 105
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, memo, formatted-text, blob, legacy]
---

```Delphi
ftFmtMemo = 18
```

### Example

```Delphi
function IsFormattedMemo(Field: TField): Boolean;
begin
  Result := Field.DataType = ftFmtMemo;
end;
```

### Usage

`ftFmtMemo` identifies a legacy formatted-text memo whose bytes and formatting grammar remain defined by the originating provider.

### Additional Technical Info
`ftFmtMemo` is declaration ordinal 18 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies provider-defined formatted memo content. The enum does not say whether the payload is RTF, HTML, a database-specific structure or another format.

The installed RTL maps this member directly to `TBlobField`, treats it as base `ftBlob` for compatibility, and includes it among blob types eligible for full-text display. Those choices do not parse, sanitise or validate its formatting. Generic string conversion follows the non-wide blob path and can apply ANSI decoding, so it is not a safe way to infer the original byte format.

Read the schema/provider documentation before interpreting the payload. Preserve opaque bytes when copying between systems unless an explicit decoder and output encoding are known. If content can be rendered, treat it as untrusted active content: formatting languages can contain links, object references or executable constructs even when the dataset only stores bytes.

For modern designs, use a documented text type plus an explicit content-format field where possible. Use [`ftMemo`](ftMemo.md) or [`ftWideMemo`](ftWideMemo.md) only when the value is plain text; use [`ftBlob`](ftBlob.md) when no text semantics are guaranteed.

The example only inspects metadata and was source-reviewed; no formatted-content parser, blob, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; identical payload formats are not implied.

<small>Created 2026-07-15</small>
