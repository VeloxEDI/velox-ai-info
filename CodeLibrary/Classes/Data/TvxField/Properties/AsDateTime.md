---
title: AsDateTime
description: Reads or writes the actual field descendant through its virtual Delphi AsDateTime conversion.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, datetime, conversion, virtual-dispatch]
---

```Delphi
property AsDateTime: TDateTime read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.IsDateType and Field.NotNull then
    Value := Field.AsDateTime
  else
    Value := Null;
end;
```

### Usage

Reads or writes the field using Velox date/time conversion rules.

### Additional Technical Info
`AsDateTime` exposes a read/write Delphi `TDateTime` value.

Velox implements both accessors as `TDateTimeField(Self).AsDateTime`. That is a static cast only: it performs no runtime `is TDateTimeField` check and does not change the object. `TField.AsDateTime` accessors are virtual, so the actual field descendant still determines what happens.

For date/time descendants, reads and writes use their normal date/time representation. Other descendants may supply a supported conversion—for example a string field can parse/format date text—or may raise the inherited field access/conversion error. Locale and field formatting can affect text-backed conversion. [`IsDateType`](../Methods/IsDateType.md) is a prudent guard when only Velox's four recognized date/time types should be accepted, but it is not a universal conversion-capability test.

Null reads follow the actual typed-field behavior; Delphi typed reads commonly return type default `0`, so test `IsNull` when database null must remain distinct from the Delphi date/time zero value.

Writing invokes the concrete field setter, can require edit/insert state, perform parsing/range/validation work, mark the record modified or raise. It does not post or commit. The operation acts on the current cursor record and the dataset owns the field.

**External references**

- [Embarcadero DocWiki: `TField.AsDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.AsDateTime) documents the virtual date/time conversion surface.
- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents unsuitable-conversion errors and null typed defaults.
- [Free Pascal: `TField.AsDateTime`](https://www.freepascal.org/docs-html/fcl/db/tfield.asdatetime.html) provides compatible field API context; Velox uses Delphi virtual dispatch.

<small>Created 2026-07-15</small>
