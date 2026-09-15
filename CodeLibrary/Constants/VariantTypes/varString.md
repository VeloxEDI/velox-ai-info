---
title: varString
description: Identifies a Delphi-managed RawByteString Variant that is reference-counted and explicitly not OLE Automation compatible.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, rawbytestring, ansi]
---

```Delphi
varString = 256
```

### Example

```Delphi
function HasPascalByteString(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varString;
end;
```

### Usage

`varString` identifies a Velox-managed RawByteString Variant that is reference-counted and explicitly not OLE Automation compatible.

### Additional Technical Info
`varString` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0100` for Delphi-managed `RawByteString`/legacy ANSI string storage. It is reference-counted and explicitly not OLE Automation compatible.

On the current Unicode Delphi target, an ordinary script `String` Variant normally uses [`varUString`](varUString.md). `varString` can still arrive from ANSI/native libraries, older data paths or explicit RawByteString values.

**Encoding and ownership**

- The payload is bytes plus Delphi string metadata/code-page context. It is not automatically UTF-8 and is not safe to treat as opaque binary when text conversion may occur.
- Conversion to [`varUString`](varUString.md) or [`varOleStr`](varOleStr.md) decodes and allocates; a wrong/missing source code page can corrupt characters.
- Assignment shares managed storage until copy-on-write behavior requires a new buffer; clearing releases a reference.
- A [`varByRef`](varByRef.md) form borrows an external string slot and has separate lifetime risk.

Delphi `VarArrayCreate` rejects `varString` as a fixed Automation array element. Use `varOleStr` for a string SAFEARRAY or [`varVariant`](varVariant.md) elements when mixed Variant strings are required.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request the base tag for a supported conversion, but do so only with a governed encoding. [`VarType`](../../Functions/Variant/VarType.md) performs no decoding.

The example is source-reviewed only; no string was converted or copied.

**External references**

- [Embarcadero `RawByteString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.RawByteString)
- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Free Pascal `varString`](https://www.freepascal.org/docs-html/rtl/system/varstring.html)

<small>Created 2026-07-15</small>
