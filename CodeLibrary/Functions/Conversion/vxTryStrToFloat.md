---
title: "vxTryStrToFloat"
description: "Attempts a system-locale Extended conversion and reports whether the output value is valid."
sidebar_position: 58
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - validation
  - locale
  - delphi
---

```Delphi
function vxTryStrToFloat(
  const S: string;
  out Value: Extended): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Parsed: Extended;
begin
  if vxTryStrToFloat('125', Parsed) then
    Value := Parsed
  else
    Value := Null;
end;
```

### Usage

`vxTryStrToFloat` attempts a system-locale Extended conversion and reports whether the output value is valid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Optional sign, decimal/scientific digits and the Windows system decimal separator, with optional surrounding ASCII spaces. |
| `Value` | `Extended`, `out` | Receives the parsed value when the function returns `True`. Treat it as undefined/unusable on `False`. |

**Returns**

`True` when the complete input is a valid target-range `Extended` value; otherwise `False`.

**Behaviour**

The Boolean is the validity contract. Ordinary accepted syntax is an optional sign, decimal digits with an optional system decimal separator, and an optional `E`/`e` exponent with optional sign and required digits. The whole token must be consumed apart from ASCII spaces at the ends.

**Errors**

Ordinary parse and floating-range failures return `False`. Locale acquisition, allocation or unexpected runtime exceptions are not caught by the function.

**Usage notes**

This is the preferred floating parser when invalid optional data is an expected branch. Pair it with an explicit `NAN`/infinity check where non-finite values are not valid domain data.

### Additional Technical Info
`vxTryStrToFloat` attempts to parse a complete Windows system-locale decimal/scientific token into `Extended`. It returns a Boolean success result instead of raising `EConvertError` for ordinary conversion failure.

The fictional integer example is source-reviewed and not executed by the documentation workflow.

**Implementation**

The formats scripting import binds the function to `vxFormats.vxTryStrToFloat`. The wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls the explicit-settings `System.SysUtils.TryStrToFloat(S, Value, AFormatSettings)` overload for `Extended`. The installed Delphi terminal directly returns its text-to-floating parser result.

**Edge cases and quirks**

- `NAN`, `INF`, `+INF` and `-INF` return `True` and place the corresponding special value in `Value`. Test finiteness separately when business rules require an ordinary number.
- The system decimal separator is mandatory; thousands separators and currency symbols return `False`.
- Overflow, malformed exponents, internal whitespace and suffix characters return `False`.
- `Extended` range and precision depend on the Delphi target, so cross-target edge values are not guaranteed to behave identically.
- Do not inspect `Value` on `False`. The low-level parser can use the destination during an attempted conversion, and the public contract supplies no meaningful failure value.
- `LOCALE_SYSTEM_DEFAULT` is the host system locale, not the service account's user locale or Delphi's mutable global format record.

**Side effects**

The caller's output variable is written on success. No persistent Velox state is changed.

**Performance and concurrency**

Parsing is linear in source length. A local settings record avoids Delphi global-format races; later calls can observe a changed Windows system locale.

**Related entries**

- [`vxStrToFloat`](vxStrToFloat.md) raises on failure.
- [`vxStrToFloatDef`](vxStrToFloatDef.md) returns a caller-supplied fallback.
- [`vxTryStrToCurr`](vxTryStrToCurr.md) targets fixed-point Currency and rejects floating special values.
- [`vxCurrStrToFloat`](vxCurrStrToFloat.md) filters characters before calling the raising floating parser.

**External references**

- [Embarcadero `System.SysUtils.TryStrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TryStrToFloat) - documents the exact Delphi Boolean overload family used by Velox.
- [Free Pascal `TryStrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/trystrtofloat.html) - compatible success/output reference; Free Pascal does not define Delphi target precision or failure-output state.

<small>Created 2026-07-15</small>
