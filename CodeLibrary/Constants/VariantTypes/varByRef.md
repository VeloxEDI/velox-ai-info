---
title: varByRef
description: Marks a Variant as an indirect reference whose pointer and referent lifetime are controlled outside the value itself.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, byref, pointer, lifetime]
---

```Delphi
varByRef = 16384
```

### Example

```Delphi
function HasIndirectStorage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varByRef) <> 0;
end;
```

### Usage

`varByRef` marks a Variant as an indirect reference whose pointer and referent lifetime are controlled outside the value itself.

### Additional Technical Info
`varByRef` is the [`TVarType`](../../Types/DataTypes/TVarType.md) flag `$4000`. It means the Variant stores an indirect pointer to a value rather than owning the base payload inline. The flag can be combined with a base code and with [`varArray`](varArray.md).

[`VarType`](../../Functions/Variant/VarType.md) returns the raw top-level tag, so test this flag directly. Some Delphi predicates call `FindVarData` and resolve the special `varByRef or varVariant` wrapper before testing the underlying type. Raw and resolved classifications can therefore be intentionally different.

**Lifetime and mutation**

- The referenced storage must remain alive, correctly typed and stable for every read or write. The numeric flag cannot prove any of those conditions.
- A by-reference Variant may alias data owned by COM, a native caller or another Variant. Changes can be visible outside the script.
- Copying the wrapper does not necessarily create an independent payload. Do not retain it beyond the callback or API scope that supplied it unless that API explicitly permits retention.
- Concurrent access is unsafe when the owner can modify, release or rebind the referent.

Velox does not expose a general pointer constructor for scripts. Do not synthesize the tag, combine it with arbitrary numbers or pass it as the requested destination type to `VarAsType`/`VarArrayCreate`. Host APIs can legitimately return it, and Delphi's `VarArrayRef` can create by-reference array wrappers on the native side.

Invalid or expired references can cause more than a normal Variant conversion error, which is why technical flows should copy required values into owned script types promptly.

The example is source-reviewed only; no indirect pointer was dereferenced.

**External references**

- [Embarcadero `VarArrayRef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayRef)
- [Embarcadero `VarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarType)
- [Free Pascal `varByRef`](https://www.freepascal.org/docs-html/rtl/system/varbyref.html)

<small>Created 2026-07-15</small>
