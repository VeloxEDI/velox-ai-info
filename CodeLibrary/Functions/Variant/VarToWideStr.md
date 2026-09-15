---
title: "VarToWideStr"
description: "Converts a Variant to OLE WideString, using Delphi's global Null string value for Null."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - widestring
  - conversion
  - 'null'
---

```Delphi
Function VarToWideStr( const V : Variant) : WideString
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: WideString;
begin
  Text := VarToWideStr(2048);
  Value := Text;
end;
```

### Usage

`VarToWideStr` converts a Variant to OLE WideString, using Velox's global Null string value for Null.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to convert. Standard scalar Variant types are supported subject to Velox conversion rules. |
| Result | `WideString` | OLE-compatible UTF-16 representation. Null returns the current `NullAsStringValue`; Empty normally returns an empty WideString. |

**Errors**

Null is handled by the global fallback. An incompatible non-Null type or failed custom/interface conversion raises an `EVariantError` item. Allocation failures also propagate.

### Additional Technical Info
`VarToWideStr` converts `V` to Delphi's `WideString` type. `WideString` is the managed OLE/BSTR-compatible UTF-16 string type, distinct from the current native Delphi `string` type even when both display the same text.

Null returns Delphi's process-global `NullAsStringValue`, converted to `WideString`. The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper delegates to `System.Variants.VarToWideStr`. Delphi implements it as `VarToWideStrDef(V, NullAsStringValue)`, so the Null branch is selected before ordinary strict Variant conversion.

Non-Null integers, floating values, Currency, dates, Booleans, native strings, OLE strings, interfaces and custom Variants follow the corresponding Delphi Variant-to-WideString path. Currency and date formatting can use the Windows user-default locale; floating/Boolean text can depend on Delphi's process-wide formatting and Variant rules.

**Edge cases and quirks**

- Null normally produces `''` because that is the default `NullAsStringValue`; host code can change the global.
- Empty also normally produces `''`, so the result alone does not preserve which missing state was supplied.
- This routine does not serialise Variant arrays or objects. Unsupported non-scalar values raise.
- `WideString` uses BSTR allocation and lifetime rules. It is useful at OLE/Automation boundaries, but does not by itself make the contents valid for XML, JSON, SQL or another external syntax.
- Converting a value to text can be locale-dependent and lossy; do not rely on the output as a stable type-preserving serialisation.

**Performance and concurrency**

The function allocates a BSTR result as required. Numeric conversion is bounded; custom/Automation conversion can do more work. The wrapper has no mutation, but output reads process-global Null, locale, Boolean and formatting settings and can be inconsistent if host code changes them concurrently.

**Related entries**

- [`VarToWideStrDef`](VarToWideStrDef.md) supplies an explicit Null result.
- [`VarToStr`](VarToStr.md) returns the native `string` type.
- [`VarIsNull`](VarIsNull.md) preserves the Null distinction before conversion.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarToWideStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarToWideStr)
- [Free Pascal: `Variants.VarToWideStr`](https://www.freepascal.org/docs-html/rtl/variants/vartowidestr.html) - compatibility context; Velox uses Delphi's BSTR and formatting behaviour.

<small>Created 2026-07-15</small>
