---
title: "StrToFloatDef"
description: "Uses the public Delphi-compatible alias to parse system-locale text as Extended, returning the supplied fallback on ordinary failure."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - locale
  - default
---

```Delphi
function StrToFloatDef(const S: string; const Default: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToFloatDef('not-a-number-value', -1.0);  // -1.0
end;
```

### Usage

`StrToFloatDef` uses the public Velox-compatible alias to parse system-locale text as Extended, returning the supplied fallback on ordinary failure.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Floating text interpreted with the Windows system locale's decimal separator. |
| `Default` | `Extended` | Value returned when the complete input cannot be converted. It is returned unchanged and can itself be zero, infinity or NaN. |

**Returns**

The parsed `Extended` value on success; otherwise `Default`. The return alone cannot distinguish a successful conversion from failure when the parsed value equals the fallback.

**Errors**

Ordinary syntax, separator and range failures return `Default`. Allocation failures or other unexpected runtime exceptions are not promised to be swallowed.

**Usage notes**

Use this function when the fallback is part of the data contract. If malformed text must be logged, rejected or distinguished from a legitimate fallback value, use a try-style conversion and handle its Boolean result.

### Additional Technical Info
`StrToFloatDef` parses an `Extended` value with Velox's Windows system-locale policy and returns `Default` if parsing fails. It is the non-raising companion to [`StrToFloat`](StrToFloat.md), with the same accepted grammar and precision constraints.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The scripting registration maps the public name to Velox `vxStrToFloatDef`. Each call creates `TFormatSettings` with `LOCALE_SYSTEM_DEFAULT` and invokes Delphi `System.SysUtils.StrToFloatDef(S, Default, AFormatSettings)`. The Delphi overload attempts the same text-to-floating conversion as `StrToFloat` and assigns `Default` when that attempt returns false.

**Edge cases and quirks**

- Decimal punctuation depends on the Windows system locale. Thousands separators and currency symbols remain invalid even when they are defined by that locale.
- Leading and trailing ASCII spaces are accepted for ordinary numeric forms; partial values or trailing non-space characters fail as a whole.
- The installed Delphi terminal accepts `NAN`, `INF`, `+INF` and `-INF` as successful special values, so `Default` is not used for those tokens.
- Precision and finite range depend on the compiled Delphi target's `Extended` representation.
- A fallback such as `0` or `-1` can also be a legitimate parsed value. The API exposes no success flag; use `vxTryStrToFloat` when the distinction is essential.
- Free Pascal's similarly named routine has a compatible high-level fallback contract, but Velox's system-locale wrapper and Delphi special-value behaviour remain authoritative.

**Side effects**

None outside local format-settings construction and temporary parsing state.

**Performance and concurrency**

Time is linear in input length plus the cost of obtaining system-locale settings for each call. The explicit local settings record avoids Delphi global-format races; subsequent calls can reflect an operating-system locale change.

**Related entries**

- [`StrToFloat`](StrToFloat.md) raises rather than returning a fallback.
- [`FloatToStr`](FloatToStr.md) converts in the other direction with Velox's system-locale settings.
- `vxTryStrToFloat` reports success separately and is documented in its own later Conversion entry.

**External references**

- [Free Pascal `StrToFloatDef`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtofloatdef.html) - compatible fallback reference with dialect-specific parser details.
- [Embarcadero `System.SysUtils.StrToFloatDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloatDef) - the exact Delphi overload family used by Velox.

<small>Created 2026-07-15</small>
