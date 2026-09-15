---
title: "IntToStr"
description: "Formats the script runtime's signed Int64 value as decimal text."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - decimal
  - pascalscript
---

```Delphi
function IntToStr(I: Int64): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IntToStr(-1234567890);  // '-1234567890'
end;
```

### Usage

`IntToStr` formats the script runtime's signed Int64 value as decimal text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `I` | `Int64` | Signed 64-bit value to format. Smaller integer types are converted by the script call rules. |

**Returns**

Only the decimal digits required to represent the magnitude, with a leading ASCII minus sign for a negative value. There is no plus sign, leading padding, thousands separator or locale-specific formatting.

**Errors**

String-allocation and script/runtime argument conversion failures can propagate. Every valid `Int64` itself has a representation.

**Usage notes**

Use this function for stable machine-readable decimal integer text. If the receiving field requires padding or a sign for positive values, apply that separate format contract explicitly rather than expecting `IntToStr` to do it.

### Additional Technical Info
`IntToStr` returns the base-10 text for a signed integer. In the current Velox PascalScript build its declaration accepts `Int64`, so the full signed 64-bit range is supported despite the shorter function name.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`IntToStr` is installed by the modified PascalScript compiler as a standard function. With current `Int64` support enabled, runtime dispatch case zero reads an `Int64` argument and calls Delphi `System.SysUtils.IntToStr(Int64)`. This is not a separate Velox numeric-formatting algorithm.

Delphi's terminal handles the complete signed range, including the minimum `Int64` value.

**Edge cases and quirks**

- Zero returns `0`; positive values have no `+` prefix.
- Output is locale-independent and contains no grouping separators.
- The current [`Int64ToStr`](Int64ToStr.md) standard function selects a separate PascalScript dispatch case but the same Delphi `Int64` formatter, so its output is identical.
- In a PascalScript build compiled without `Int64` support, the installed declaration and runtime argument width would differ. That is not the reviewed Velox configuration.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Constant bounded numeric conversion with no shared mutable state or locale dependency.

**Related entries**

- [`Int64ToStr`](Int64ToStr.md) is the explicit 64-bit alias in the current PascalScript runtime.
- [`IntToHex`](IntToHex.md) returns uppercase hexadecimal bit-pattern text.
- [`FloatToStr`](FloatToStr.md) has locale and precision behaviour that does not apply here.

**External references**

- [Embarcadero `System.SysUtils.IntToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToStr) - the exact Delphi `Int64` terminal.
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible signed-decimal reference; Velox executes the Delphi/PascalScript implementation.

<small>Created 2026-07-15</small>
