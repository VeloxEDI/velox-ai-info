---
title: varOleStr
description: Identifies a BSTR-backed Unicode Variant string used for OLE Automation and fixed-type Variant string arrays.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, bstr, unicode]
---

```Delphi
varOleStr = 8
```

### Example

```Delphi
function IsAutomationString(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varOleStr;
end;
```

### Usage

`varOleStr` identifies a BSTR-backed Unicode Variant string used for OLE Automation and fixed-type Variant string arrays.

### Additional Technical Info
`varOleStr` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0008` for an OLE `BSTR`/Delphi `WideString`. It is a length-prefixed Unicode string allocated and released with Automation-compatible ownership rules.

Use this element type for Automation-compatible Variant string arrays; Delphi's `VarArrayCreate` rejects Pascal-managed [`varString`](varString.md) and [`varUString`](varUString.md) element types. Converting between them can allocate and copy data.

**String boundaries**

- BSTR can contain embedded null characters because it carries a length. Native APIs that treat text as null-terminated can truncate it.
- Conversion from `varString` decodes an ANSI/RawByteString using its code-page context; unrepresentable or incorrectly tagged bytes can become different Unicode text.
- A BSTR is text, not an encoded byte buffer. Use `varArray or varByte` for opaque binary data.
- A by-reference BSTR borrows external storage and has a stricter lifetime than an owned value.

[`VarAsType`](../../Functions/Variant/VarAsType.md) with `varOleStr` formats/converts the source and can invoke locale-sensitive rules or raise. [`VarType`](../../Functions/Variant/VarType.md) only inspects the tag; mask away flags when classifying.

The example is source-reviewed only; no BSTR was allocated or converted.

**External references**

- [Embarcadero `WideString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.WideString)
- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Free Pascal `varOleStr`](https://www.freepascal.org/docs-html/rtl/system/varolestr.html)

<small>Created 2026-07-15</small>
