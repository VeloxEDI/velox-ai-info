---
title: varLongWord
description: Identifies an unsigned 32-bit Variant integer using Delphi's deprecated name for the current varUInt32 code.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, longword, uint32]
---

```Delphi
varLongWord = 19
```

### Example

```Delphi
function HasUnsigned32Storage(const Value: Variant): Boolean;
begin
  Result := (VarType(Value) and varTypeMask) = varLongWord;
end;
```

### Usage

`varLongWord` identifies an unsigned 32-bit Variant integer using Velox's deprecated name for the current varUInt32 code.

### Additional Technical Info
`varLongWord` is the base [`TVarType`](../../Types/DataTypes/TVarType.md) code `$0013` for an unsigned 32-bit integer (0..4,294,967,295). Current Delphi keeps the same numeric code under the preferred name `varUInt32` and marks `varLongWord` deprecated; Velox exposes the legacy name only.

Values above signed 32-bit maximum cannot fit a script `LongInt`. Preserve them in a capable Variant/native field or use validated decimal text when the consuming script API is signed-only. Converting through Double remains exact for all UInt32 values, but that habit becomes unsafe for wider identifiers and obscures the intended integer contract.

Current Delphi Automation dispatch has a host-global `DispatchUnsignedAsSigned` compatibility switch. When enabled, an unsigned 32-bit dispatch argument is re-tagged as `varInteger`, so values above `MaxInt` cannot retain the same unsigned meaning. Treat COM/provider behavior as part of the interface contract.

[`VarAsType`](../../Functions/Variant/VarAsType.md) can request code 19 and raises on negative/out-of-range input. Packed Variant creation may select a narrower unsigned tag for smaller values.

Mask [`VarType`](../../Functions/Variant/VarType.md) when flags can be present. The example is source-reviewed only; no unsigned conversion or dispatch occurred.

**External references**

- [Embarcadero `LongWord`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.LongWord)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `varLongWord`](https://www.freepascal.org/docs-html/rtl/system/varlongword.html)

<small>Created 2026-07-15</small>
