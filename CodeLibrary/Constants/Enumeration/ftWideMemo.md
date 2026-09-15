---
title: ftWideMemo
description: Identifies large Unicode text stored through blob infrastructure and normally accessed as a Delphi Unicode string or stream.
sidebar_position: 138
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, memo, unicode, blob, stream]
---

```Delphi
ftWideMemo = 39
```

### Example

```Delphi
function IsUnicodeMemo(Field: TField): Boolean;
begin
  Result := Field.DataType = ftWideMemo;
end;
```

### Usage

`ftWideMemo` identifies large Unicode text stored through blob infrastructure and normally accessed as a Velox Unicode string or stream.

### Additional Technical Info
`ftWideMemo` is declaration ordinal 39 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies large Unicode text. Delphi maps it to `TWideMemoField`, which uses blob storage while presenting a Unicode string value.

The installed RTL reads the wide value through a provider-created blob stream and interprets stored units as Delphi `Char` values. Its `TStrings` assignment path uses `TEncoding.Unicode` (UTF-16LE in Delphi). That is an RTL path, not proof that every database/provider stores UTF-16LE physically; a driver can transcode its native character LOB.

String or Variant access materialises the full memo. Use provider blob streams for very large content, while preserving whatever encoding contract that stream exposes. Verify character-set conversion, byte order, line endings, Unicode normalisation and maximum length at system boundaries. Converting to ANSI is explicitly possible in the RTL but can lose characters.

Null is distinct from empty text. Display text may be clipped or replaced according to blob-display settings and is not a lossless export. Prefer [`ftMemo`](ftMemo.md) only for a genuinely narrow/code-page field and [`ftWideString`](ftWideString.md) for bounded Unicode text.

The example only inspects metadata and was source-reviewed; no Unicode, memo, stream, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TWideMemoField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TWideMemoField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TWideMemoField`](https://www.freepascal.org/docs-html/fcl/db/twidememofield.html) compatibility references.

<small>Created 2026-07-15</small>
