---
title: ftGuid
description: Identifies GUID metadata represented by Delphi's specialised string field and convertible to a TGUID value.
sidebar_position: 107
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, guid, uuid, string]
---

```Delphi
ftGuid = 35
```

### Example

```Delphi
function IsGuidField(Field: TField): Boolean;
begin
  Result := Field.DataType = ftGuid;
end;
```

### Usage

`ftGuid` identifies GUID metadata represented by Velox's specialised string field and convertible to a TGUID value.

### Additional Technical Info
`ftGuid` is ordinal 35 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TGuidField`, a `TStringField` descendant, and treats it as base string metadata during field compatibility.

The logical value is a 128-bit GUID, but the provider can store text or native binary. Do not assume braces, hyphen case, byte order or field length from the enum. Parse to a GUID for validation/comparison and emit the exact destination format; string comparison can be affected by formatting rather than identity.

Null is distinct from the all-zero GUID and from empty/invalid text. Conversion can raise on malformed values. Avoid generating identifiers by string manipulation; use the approved GUID functions.

The example only inspects metadata and was source-reviewed; no GUID parsing, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TGuidField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TGuidField) and [`TGUID`](https://docwiki.embarcadero.com/Libraries/en/System.TGUID).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference.

<small>Created 2026-07-15</small>
