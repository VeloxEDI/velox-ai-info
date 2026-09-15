---
title: IsStringType
description: Reports whether the field DataType belongs to Velox's fixed string, memo or GUID set.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, string, memo, guid, datatype]
---

```Delphi
function IsStringType: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.IsStringType then
    Value := Field.AsStringTrim
  else
    Value := Field.Value;
end;
```

### Usage

`IsStringType` reports whether the field DataType belongs to Velox's fixed string, memo or GUID set.

### Additional Technical Info
`IsStringType` returns true only when `DataType` is one of:

```text
ftString, ftWideString, ftMemo, ftWideMemo,
ftFixedChar, ftFixedWideChar, ftGuid
```

The list includes GUIDs because Velox treats their field representation as string-like. It does not include every type that can produce `AsString`; for example, formatted memo/vendor CLOB types, byte fields and numeric/date types return false unless their exact `TFieldType` appears above.

This method is independent of [`IsNullEmpty`](IsNullEmpty.md), which converts *every* field to trimmed text, and independent of [`IsNumericType`](IsNumericType.md). Use it when the fixed Velox category is the desired rule, not as proof that text conversion is safe or lossless.

The test is constant-time, does not access the current value and has no dataset side effect. It requires a valid live field object.

**External references**

- [Embarcadero DocWiki: `TField.DataType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.DataType) documents the property being classified.
- [Free Pascal: `TField.DataType`](https://www.freepascal.org/docs-html/fcl/db/tfield.datatype.html) provides compatible field-model context; exact membership is Velox-specific.

<small>Created 2026-07-15</small>
