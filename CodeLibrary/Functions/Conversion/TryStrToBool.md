---
title: "TryStrToBool"
description: "Attempts to convert numeric or Boolean text and reports whether the output value is valid."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - boolean
  - validation
  - delphi
---

```Delphi
function TryStrToBool(const S: string; out Value: Boolean): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Parsed: Boolean;
begin
  if TryStrToBool(VarToStr(Value), Parsed) then
    Value := Parsed
  else
    Value := False;
end;
```

### Usage

`TryStrToBool` attempts to convert numeric or Boolean text and reports whether the output value is valid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Numeric or named Boolean text to test. Numeric zero is false; non-zero numeric input is true; names are case-insensitive. |
| `Value` | `Boolean` (`out`) | Receives the converted Boolean only when the function returns `True`. Its content is not a valid result after failure. |

**Returns**

`True` when numeric parsing or configured-name matching succeeds; `False` otherwise. This return is conversion status, not the parsed Boolean itself.

**Behaviour**

The two Boolean outcomes therefore require two values: the function result says whether conversion succeeded, while the `out` parameter contains true or false data. A valid false input such as `0` or `False` returns function result `True` and output value `False`.

**Errors**

Unrecognised text returns `False` rather than raising. Unexpected allocation or runtime errors are not converted to a false status.

**Usage notes**

Velox uses short-circuit Boolean evaluation, so `if TryStrToBool(S, B) and B then ...` does not read `B` after a failed conversion. A nested `if` or separate statements can make the success-before-value rule clearer.

### Additional Technical Info
`TryStrToBool` attempts the same numeric-first and named-Boolean conversion as [`StrToBool`](StrToBool.md), but returns a success flag instead of raising for unrecognised text. Read the `Value` output only when the function returns `True`.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox SysUtils scripting adapter calls Delphi `System.SysUtils.TryStrToBool`. The terminal first calls the global-format overload of `TryStrToFloat`. Successful numeric conversion assigns `Value := Number <> 0`. If numeric conversion fails, it lazily verifies the process-wide `TrueBoolStrs`/`FalseBoolStrs` arrays and compares `S` against their values without regard to case.

**Edge cases and quirks**

- Numeric parsing happens before name matching and uses shared Delphi `FormatSettings`, not Velox's system-locale [`StrToFloat`](StrToFloat.md) wrapper.
- The installed floating terminal recognises `NAN`, `INF`, `+INF` and `-INF`. These are successful numeric conversions and currently yield output `True` through the non-zero comparison.
- Named matching ignores case but does not trim the input. Added whitespace can turn a named Boolean into a failed conversion.
- If both configured arrays contain the same spelling, the true-array check wins because it is performed first.
- On complete failure the implementation does not assign a meaningful `Value`. Free Pascal explicitly documents the output as undetermined in this case; the same safe-use rule applies to the Delphi/Velox path.
- Empty Boolean-name arrays can be initialised lazily with the default `True` and `False` strings.

**Side effects**

The first non-numeric call can initialise the process-wide Boolean string arrays. No Velox data is changed except through the caller's deliberate use of the `out` value.

**Performance and concurrency**

Linear in input and configured-name lengths. The routine reads global format settings and can initialise shared name arrays, so concurrent host mutation of those globals can affect conversion.

**Related entries**

- [`StrToBool`](StrToBool.md) returns the parsed value and raises on failure.
- [`StrToBoolDef`](StrToBoolDef.md) replaces failure with a supplied Boolean.
- [`StrToFloat`](StrToFloat.md) documents Velox's separate system-locale floating conversion.

**External references**

- [Free Pascal `TryStrToBool`](https://www.freepascal.org/daily/doc/rtl/sysutils/trystrtobool.html) - confirms the success/output contract and undefined output after failure for the compatible routine.
- [Embarcadero `System.SysUtils.TryStrToBool`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TryStrToBool) - the Delphi terminal selected by Velox.

<small>Created 2026-07-15</small>
