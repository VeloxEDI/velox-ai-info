---
title: ftMemo
description: Identifies large narrow text stored through blob infrastructure, with ANSI code-page conversion and whole-value memory risks.
sidebar_position: 113
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, memo, text, ansi, blob]
---

```Delphi
ftMemo = 16
```

### Example

```Delphi
function IsNarrowTextMemo(Field: TField): Boolean;
begin
  Result := Field.DataType = ftMemo;
end;
```

### Usage

`ftMemo` identifies large narrow text stored through blob infrastructure, with ANSI code-page conversion and whole-value memory risks.

### Additional Technical Info
`ftMemo` is declaration ordinal 16 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies large text in Delphi's traditional narrow memo family. Although logically text, it uses BLOB storage and stream access rather than the ordinary record buffer.

The installed RTL maps it to `TMemoField`, which descends from `TBlobField`, enables transliteration and uses ANSI-string behavior on the current Windows build. Unicode assignment can therefore pass through the active code page and lose characters that are not representable. The enum does not record the database character set, line-ending convention, maximum size or collation.

Use [`ftWideMemo`](ftWideMemo.md) for Unicode large text where the provider supports it. For a current `ftMemo`, obtain encoding rules from the source schema/driver and normalise line endings only when the integration contract requires it. `AsString`, `AsVariant` and byte-array access can load the entire memo; prefer a blob stream for large values.

Null, empty text and a zero-length but non-Null LOB can be distinct. Display conversions may clip or substitute a class description depending on dataset display settings, so display text is not a lossless export path.

The example only inspects metadata and was source-reviewed; no encoding, memo, stream, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TMemoField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TMemoField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TMemoField`](https://www.freepascal.org/docs-html/fcl/db/tmemofield.html) compatibility references.

<small>Created 2026-07-15</small>
