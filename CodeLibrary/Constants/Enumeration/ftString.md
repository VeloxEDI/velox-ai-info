---
title: ftString
description: Identifies variable narrow character data whose Size and ANSI conversion behavior come from the concrete field and provider.
sidebar_position: 126
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, string, ansi, encoding, size]
---

```Delphi
ftString = 1
```

### Example

```Delphi
function IsNarrowString(Field: TField): Boolean;
begin
  Result := Field.DataType = ftString;
end;
```

### Usage

`ftString` identifies variable narrow character data whose Size and ANSI conversion behaviour come from the field and provider.

### Additional Technical Info
`ftString` is declaration ordinal 1 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies a normal variable-length field in Delphi's traditional narrow/ANSI string family.

The installed RTL maps it to `TStringField`. A new field defaults to `Size = 20`, but provider or persistent field metadata determines the live capacity; never infer a database column's length from that constructor default. The class supports conversions to Boolean, numeric, date/time and GUID values, but those conversions use Delphi parsing rules and can raise errors. The enum itself promises only the field family.

On the current Windows build, ANSI conversion can depend on the process/system code page. Assigning Unicode characters that are not representable can be lossy. Use [`ftWideString`](ftWideString.md) for Unicode data where supported. Treat `Size` as provider metadata, not a universal UTF-8 byte limit: characters, UTF-16 code units and encoded bytes can have different counts.

Null is distinct from `''`. Provider collation, trailing-space treatment and case sensitivity control database comparisons; a Delphi string comparison may not reproduce them. Validate and truncate deliberately before assignment because drivers can reject, truncate or transform oversized values differently.

The example only inspects metadata and was source-reviewed; no encoding, parsing, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TStringField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TStringField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TStringField`](https://www.freepascal.org/docs-html/fcl/db/tstringfield.html) compatibility references.

<small>Created 2026-07-15</small>
