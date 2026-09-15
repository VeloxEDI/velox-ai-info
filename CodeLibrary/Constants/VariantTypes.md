---
title: Variant Types
description: "Raw Variant base-type codes, storage modifiers and masks used to inspect Delphi and Automation Variant representation."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, variant, vartype, automation, array, byref]
---

## Available type codes

Velox exposes these 26 constants as `Word` values. They describe the raw representation returned by [`VarType`](../Functions/Variant/VarType.md); they do not convert a value merely by being compared or combined.

| Category | Constants | Key boundary |
|---|---|---|
| Empty/missing/error | [`varEmpty`](VariantTypes/varEmpty.md), [`varNull`](VariantTypes/varNull.md), [`varError`](VariantTypes/varError.md) | Unassigned, explicit Null and HRESULT/optional-argument error are three different states. |
| Signed integers | [`varShortInt`](VariantTypes/varShortInt.md), [`varSmallInt`](VariantTypes/varSmallInt.md), [`varInteger`](VariantTypes/varInteger.md), [`varInt64`](VariantTypes/varInt64.md) | 8-, 16-, 32- and 64-bit storage; a script `LongInt` cannot hold every `varInt64` value. |
| Unsigned integers | [`varByte`](VariantTypes/varByte.md), [`varWord`](VariantTypes/varWord.md), [`varLongWord`](VariantTypes/varLongWord.md) | 8-, 16- and 32-bit storage; `varLongWord` is the legacy Delphi name for the unsigned 32-bit code. |
| Decimal/date/floating | [`varCurrency`](VariantTypes/varCurrency.md), [`varDate`](VariantTypes/varDate.md), [`varSingle`](VariantTypes/varSingle.md), [`varDouble`](VariantTypes/varDouble.md) | Currency has exact four-decimal scaling; date is an Automation day count; binary floats have rounding, NaN and infinity behavior. |
| Strings | [`varOleStr`](VariantTypes/varOleStr.md), [`varString`](VariantTypes/varString.md), [`varUString`](VariantTypes/varUString.md), [`varStrArg`](VariantTypes/varStrArg.md) | BSTR is Automation-safe; managed RawByteString/UnicodeString codes are Delphi-specific; `varStrArg` is historical code 72, not an ordinary string type. |
| Interfaces | [`varDispatch`](VariantTypes/varDispatch.md), [`varUnknown`](VariantTypes/varUnknown.md) | Reference-counted interfaces; dispatch access can execute external code and `IUnknown` does not guarantee late binding. |
| Nested/host representations | [`varVariant`](VariantTypes/varVariant.md), [`varAny`](VariantTypes/varAny.md) | Nested Variant/by-reference storage and Delphi's host-managed CORBA Any representation. |
| Modifiers and mask | [`varArray`](VariantTypes/varArray.md), [`varByRef`](VariantTypes/varByRef.md), [`varTypeMask`](VariantTypes/varTypeMask.md) | Array and indirect-reference bits modify a base type; mask them before testing the low 12-bit base code. |

## Correct inspection pattern

```Delphi
RawType := VarType(Value);
BaseType := RawType and varTypeMask;
IsArray := (RawType and varArray) <> 0;
IsByReference := (RawType and varByRef) <> 0;
```

Testing `VarType(Value) = varByte` rejects a byte array because its raw code also contains `varArray`. Conversely, masking first loses information about arrays and references, so retain the raw code when storage/lifetime matters.

## Representation and conversion boundaries

- A mathematical value does not identify one Variant tag. Packed creation and external Automation providers can choose narrower or different compatible representations.
- `varDate` and `varDouble` use the same physical floating width but have different semantic conversion rules.
- Delphi-managed `varString` and `varUString` are not portable OLE Automation types. Cross-process/COM APIs generally require Automation-compatible types such as `varOleStr`.
- `varByRef` points at storage owned elsewhere. Its validity and mutability depend on the caller's lifetime; retaining or dereferencing it outside that contract is unsafe.
- Variant arrays can have non-zero and multidimensional bounds. Inspect bounds rather than assuming a zero-based one-dimensional list.
- Interface and managed-string Variants participate in reference counting. Assignment and clearing can execute lifetime management; `varDispatch` member access can invoke arbitrary provider code.
- Raw codes are runtime representation details. Do not persist them as business type identifiers or use them in place of dataset [`TFieldType`](../Types/Enumerations/TFieldType.md).

**External references**

- [Embarcadero `TVarData`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TVarData)
- [Embarcadero Variant type constants](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants)
- [Free Pascal System Variant type constants](https://www.freepascal.org/docs-html/rtl/system/index-2.html)

<small>Created 2026-07-15</small>
