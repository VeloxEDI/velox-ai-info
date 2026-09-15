---
title: varStrArg
description: Exposes the historical Variant code 72, now aligned with VT_CLSID and unsuitable as a normal script string type.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, strarg, clsid]
---

```Delphi
varStrArg = 72
```

### Example

```Delphi
function HasInternalStrArgTag(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varStrArg;
end;
```

### Usage

`varStrArg` exposes the historical Variant code 72, now aligned with VT_CLSID and unsuitable as a normal script string type.

### Additional Technical Info
`varStrArg` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0048`. Velox exposes it because the modified compiler imports Delphi's historical constant set. In the current Delphi `System.pas`, code 72 is annotated as OLE `VT_CLSID`; older documentation has also described `varStrArg` as a COM-compatible argument string.

That history makes it an interoperability/internal tag, not a normal durable script string type. Ordinary current text Variants use [`varUString`](varUString.md), [`varString`](varString.md) or Automation [`varOleStr`](varOleStr.md).

**Do not synthesize this type**

- Do not pass `varStrArg` to [`VarAsType`](../../Functions/Variant/VarAsType.md) or [`VarArrayCreate`](../../Functions/Variant/VarArrayCreate.md) as a general string conversion target.
- Do not assume its payload is a managed Delphi string or safe to dereference.
- If a native/Automation provider supplies the tag, follow that exact provider's ABI, ownership and lifetime contract; copy usable text through its documented API.
- Never persist numeric code 72 as proof that a field contains text. Delphi/OLE version and ABI context are essential.

[`VarType`](../../Functions/Variant/VarType.md) can report the code without interpreting the payload. This page intentionally documents the current source conflict rather than repeating the older friendly label as guaranteed behavior.

The example is source-reviewed only; no internal payload was created or read.

**External references**

- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Embarcadero `TVarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TVarType)
- [Free Pascal `varStrArg`](https://www.freepascal.org/docs-html/rtl/system/varstrarg.html)

<small>Created 2026-07-15</small>
