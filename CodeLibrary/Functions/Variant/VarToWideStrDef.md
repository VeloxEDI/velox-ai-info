---
title: "VarToWideStrDef"
description: "Converts a Variant to WideString and returns a caller-supplied value only for Null."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - widestring
  - fallback
  - 'null'
---

```Delphi
Function VarToWideStrDef( const V : Variant; const ADefault : WideString) : WideString
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: WideString;
begin
  Text := VarToWideStrDef(Null, '(missing)');
  Value := Text;
end;
```

### Usage

`VarToWideStrDef` converts a Variant to WideString and returns a caller-supplied value only for Null.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to test for Null and otherwise convert. |
| `ADefault` | `WideString` (`const`) | Exact OLE/BSTR string returned when `V` is Null. It is not an error fallback. |
| Result | `WideString` | `ADefault` for Null; otherwise the converted OLE-compatible UTF-16 text. |

**Errors**

Non-Null Variant arrays, incompatible interfaces/custom types and other failed conversions raise `EVariantError` items. The function does not catch those failures or substitute `ADefault` for them. BSTR allocation failures also propagate.

### Additional Technical Info
`VarToWideStrDef` returns `ADefault` when `V` is Null. Every non-Null value follows Delphi's normal Variant-to-`WideString` conversion and can still raise if it is incompatible.

The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper directly calls `System.Variants.VarToWideStrDef`. Delphi uses `VarIsNull` to select the default branch. A non-Null value is assigned to the `WideString` result through the Variant conversion engine.

The fallback is therefore narrower than its name can suggest: it is a Null substitute only.

**Behaviour and quirks**

- Empty/Unassigned normally converts to an empty WideString instead of returning `ADefault`.
- Empty text, zero and false are ordinary values and do not select the default.
- `ADefault` is used instead of the process-global `NullAsStringValue`, making the Null representation local to this call.
- Date, Currency, floating and Boolean text retains the locale/global dependencies of [`VarToWideStr`](VarToWideStr.md).
- If the same text can arise from a real value, the result cannot prove that the input was Null. Test [`VarIsNull`](VarIsNull.md) before conversion when provenance is required.

**Performance and concurrency**

The Null path returns a managed BSTR copy/reference of `ADefault`. Other paths allocate and format according to the source type. The wrapper has no side effects; non-Null conversions can read process-wide locale and Variant formatting state.

**Related entries**

- [`VarToWideStr`](VarToWideStr.md) uses the process-global Null string value.
- [`VarToStrDef`](VarToStrDef.md) returns the native `string` type with the same Null-only default rule.
- [`VarIsNull`](VarIsNull.md) explicitly identifies the default branch.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarToWideStrDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarToWideStrDef)
- [Free Pascal: `Variants.VarToWideStrDef`](https://www.freepascal.org/docs-html/rtl/variants/vartowidestrdef.html) - compatibility context for the Null-only WideString default.

<small>Created 2026-07-15</small>
