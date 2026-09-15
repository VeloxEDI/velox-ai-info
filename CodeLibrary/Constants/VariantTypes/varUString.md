---
title: varUString
description: Identifies a Delphi-managed UnicodeString Variant used by ordinary strings on Velox's current Unicode target.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, unicodestring, text]
---

```Delphi
varUString = 258
```

### Example

```Delphi
function HasNativeUnicodeString(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varUString;
end;
```

### Usage

`varUString` identifies a Velox-managed UnicodeString Variant used by ordinary strings on Velox's current Unicode target.

### Additional Technical Info
`varUString` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0102` for a Delphi-managed `UnicodeString`. The modified compiler registers it only on Unicode Delphi targets; Velox's current target satisfies that condition, and ordinary script `String` values normally use this representation when stored in a Variant.

The payload is reference-counted UTF-16 text and is explicitly not an OLE base type. Automation uses [`varOleStr`](varOleStr.md) (`BSTR`), so crossing that boundary can allocate/copy even though both hold Unicode text.

**Text and ownership boundaries**

- Length is measured in UTF-16 code units, not user-perceived characters. A supplementary Unicode character uses a surrogate pair.
- Embedded null characters are valid in the managed string but can be truncated by null-terminated APIs.
- Assignment shares reference-counted storage until copy-on-write behavior requires separation; clearing releases a reference.
- Conversion to/from [`varString`](varString.md) applies a byte-string code page and can lose data.
- Delphi `VarArrayCreate` does not accept `varUString` as a fixed SAFEARRAY element type; use `varOleStr` or Variant elements.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request `varUString` for supported values. [`VarType`](../../Functions/Variant/VarType.md) inspects without formatting or allocation.

The example is source-reviewed only; no Unicode text was allocated or converted.

**External references**

- [Embarcadero `UnicodeString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.UnicodeString)
- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Free Pascal `varUString`](https://www.freepascal.org/docs-html/rtl/system/varustring.html)

<small>Created 2026-07-15</small>
