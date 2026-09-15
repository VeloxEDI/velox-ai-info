---
title: "vxStrToFloatDef"
description: "Uses the Velox-prefixed implementation name to parse system-locale text as Extended, returning the supplied fallback on ordinary failure."
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - floating-point
  - fallback
  - locale
  - delphi
---

```Delphi
function vxStrToFloatDef(
  const S: string;
  const Default: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxStrToFloatDef('not a number', -1);
end;
```

### Usage

Use `vxStrToFloatDef(Text, Default)` to parse a system-locale floating-point value and return `Default` when ordinary conversion fails. The whole trimmed input must be valid; grouping and currency symbols are not accepted.

Because a successfully parsed value can equal `Default`, use [`vxTryStrToFloat`](vxTryStrToFloat.md) when the script must distinguish failure from a legitimate fallback value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Locale-sensitive decimal/scientific text; grouping and currency symbols are invalid. |
| `Default` | `Extended`, `const` | Returned when syntax, complete-consumption or target-range validation fails. |

**Returns**

The parsed `Extended` on success; otherwise exactly `Default`. A successful result equal to `Default` is indistinguishable from failure by inspecting the return alone.

**Behaviour**

Accepted ordinary syntax is an optional sign, digits, an optional system decimal separator, and an optional signed decimal exponent with required exponent digits. Leading/trailing ASCII spaces are accepted; other extra characters are not.

**Errors**

Ordinary syntax and floating-range failures return `Default`. Locale acquisition, allocation and unexpected runtime exceptions can still propagate.

**Usage notes**

Use [`vxTryStrToFloat`](vxTryStrToFloat.md) when a fallback collision matters. Treat a fallback as a deliberate data-quality rule and account explicitly for accepted floating special values.

### Additional Technical Info
`vxStrToFloatDef` parses complete Windows system-locale decimal/scientific text as `Extended`. It returns the caller's `Default` value when ordinary conversion fails. The current script name [`StrToFloatDef`](StrToFloatDef.md) is registered to the same implementation.

The fictional example uses an application-selected sentinel. It is source-reviewed and not executed by the documentation workflow.

**Implementation**

The formats import registers `vxStrToFloatDef` and `StrToFloatDef` against `vxFormats.vxStrToFloatDef`. The wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToFloatDef(S, Default, AFormatSettings)`. The installed Delphi terminal runs the same text-to-Extended conversion as `StrToFloat` and substitutes `Default` only when that conversion reports `False`.

**Edge cases and quirks**

- A valid parsed value can equal `Default`, so this function cannot prove whether parsing succeeded.
- `NAN`, `INF`, `+INF` and `-INF` are successful Delphi `Extended` values and do **not** select `Default`.
- The wrong locale decimal character, thousands grouping, a currency symbol, incomplete exponent or overflow selects `Default` without identifying the reason.
- `Extended` precision and range depend on the build target. A source can parse on one target and overflow or round differently on another.
- Locale is the Windows system default, not a user profile or Delphi global format record. Host migration can change acceptance.
- [`StrToFloatDef`](StrToFloatDef.md) is an exact Velox scripting alias, not PascalScript's independent built-in converter.

**Side effects**

No persistent state changes. Local locale and parser records are created for the call.

**Performance and concurrency**

Parsing is linear in source length. Explicit local settings avoid races on Delphi global formatting state; a later Windows system-locale change can affect later calls.

**Related entries**

- [`StrToFloatDef`](StrToFloatDef.md) is an exact registered alias.
- [`vxStrToFloat`](vxStrToFloat.md) raises on failure.
- [`vxTryStrToFloat`](vxTryStrToFloat.md) reports success separately.

**External references**

- [Embarcadero `System.SysUtils.StrToFloatDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloatDef) - documents the Delphi explicit-settings fallback overload used by Velox.
- [Free Pascal `StrToFloatDef`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtofloatdef.html) - compatible fallback reference; target precision and special-value behaviour remain Delphi-specific.

<small>Created 2026-07-15</small>
