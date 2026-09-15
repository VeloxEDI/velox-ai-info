---
title: ftVarBytes
description: Identifies a variable-length inline byte sequence with a declared maximum Size and a length-prefixed Delphi field buffer.
sidebar_position: 136
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, bytes, binary, variable-length]
---

```Delphi
ftVarBytes = 13
```

### Example

```Delphi
function IsVariableBinary(Field: TField): Boolean;
begin
  Result := Field.DataType = ftVarBytes;
end;
```

### Usage

`ftVarBytes` identifies a variable-length inline byte sequence with a declared maximum Size and a length-prefixed Velox field buffer.

### Additional Technical Info
`ftVarBytes` is declaration ordinal 13 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies variable-length binary data stored in the normal record buffer rather than as a streamed large object.

The installed RTL maps it to `TVarBytesField`. A new field defaults to `Size = 16`; live provider metadata supplies the actual maximum. Its internal `DataSize` is `Size + SizeOf(Word)` because Delphi's field buffer includes a two-byte length prefix. That prefix is an RTL buffer detail, not automatically part of the logical byte value or an external wire format.

Use byte-array access and preserve the actual logical length. Dataset compatibility checks require matching `Size`. Both current setters have a special case when an ordinary byte array or Variant array has exactly `DataSize` (`Size + 2`) elements: they assume the array already contains a native length prefix. That is not a valid maximum-length logical value; a logical value is at most `Size` bytes.

The special branch then constructs only `SizeOf(Pointer)` bytes before calling `SetData` in native format, rather than passing the complete prefixed buffer. This is a current installed-RTL quirk and can supply incomplete native data to the provider. Do not manufacture or pass a `Size + 2` array to trigger it. Pass an unprefixed logical byte array no longer than `Size` so the normal non-native path is used, and let the field/provider create its internal prefix.

The enum conveys no encoding or packed structure. Null, zero-length and all-zero values are distinct. Choose [`ftBytes`](ftBytes.md) for an exact fixed-length sequence and [`ftBlob`](ftBlob.md) when size or streaming requirements exceed ordinary record-buffer use.

The example only inspects metadata and was source-reviewed; no byte-array conversion, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TVarBytesField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TVarBytesField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TVarBytesField`](https://www.freepascal.org/docs-html/fcl/db/tvarbytesfield.html) compatibility references.

<small>Created 2026-07-15</small>
