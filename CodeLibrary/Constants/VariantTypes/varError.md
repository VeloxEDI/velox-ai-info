---
title: varError
description: Identifies a Variant that stores an HRESULT or SCODE value, including Automation's missing optional-parameter sentinel.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, hresult, error]
---

```Delphi
varError = 10
```

### Example

```Delphi
function HasErrorCode(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varError;
end;
```

### Usage

`varError` identifies a Variant that stores an HRESULT or SCODE value, including Automation's missing optional-parameter sentinel.

### Additional Technical Info
`varError` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$000A` for a stored 32-bit HRESULT/SCODE. The payload is data describing an operating-system or Automation status; merely holding it does not raise an exception.

Native Delphi uses a `varError` containing `DISP_E_PARAMNOTFOUND` (`$80020004`) for an omitted optional Automation argument. That is different from [`varEmpty`](varEmpty.md), [`varNull`](varNull.md), a returned failure HRESULT and a Delphi exception. The same tag can also contain other status codes.

Velox exposes the tag but not a safe general-purpose constructor for arbitrary HRESULT values. [`VarAsType`](../../Functions/Variant/VarAsType.md) is not a substitute for an API-specific error constructor, and numeric equality alone does not establish how a provider intends the code to be handled.

**Handling guidance**

- Inspect the tag before interpreting the payload; normal numeric/string conversion can raise or lose HRESULT semantics.
- Apply the owning API's contract and translate a known code into a governed Velox error/result only at the boundary.
- Do not use this type to suppress exceptions or to signal ordinary business validation failures unless the receiving Automation API explicitly requires it.
- By-reference forms inherit external lifetime and mutation risk.

[`VarType`](../../Functions/Variant/VarType.md) reads the tag without raising the stored error. Later conversion or dispatch may translate the HRESULT into a Variant/Automation exception.

The example is source-reviewed only; no HRESULT was constructed or handled.

**External references**

- [Embarcadero `VarIsError`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsError)
- [Embarcadero `EmptyParam`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.EmptyParam)
- [Free Pascal `varError`](https://www.freepascal.org/docs-html/rtl/system/varerror.html)

<small>Created 2026-07-15</small>
