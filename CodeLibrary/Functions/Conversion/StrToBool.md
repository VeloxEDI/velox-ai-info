---
title: "StrToBool"
description: "Converts recognised numeric or Boolean text to a Boolean and raises for unrecognised input."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - boolean
  - parsing
  - delphi
---

```Delphi
function StrToBool(const S: string): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToBool('true');  // True
end;
```

### Usage

`StrToBool` converts recognised numeric or Boolean text to a Boolean and raises for unrecognised input.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Numeric or named Boolean text. Named values are matched without regard to case. The default names are `True` and `False`. |

**Returns**

`False` for numeric zero or a recognised false name; `True` for a non-zero number or a recognised true name.

**Errors**

Text that is neither a valid number nor a configured Boolean name raises `EConvertError`, which propagates as a script runtime exception. Use [`StrToBoolDef`](StrToBoolDef.md) for a fallback or [`TryStrToBool`](TryStrToBool.md) when failure must remain explicit without an exception.

**Usage notes**

Use named `True`/`False` text for human-readable configuration and numeric `0`/`1` only when that contract is deliberate. Do not treat every non-empty string as true.

### Additional Technical Info
`StrToBool` converts numeric text or a recognised Boolean name to `Boolean`. It tries floating-point conversion first: numeric zero becomes `False`, while any non-zero numeric value becomes `True`. If the text is not numeric, it performs a case-insensitive comparison with Delphi's process-wide true and false string arrays.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox registers a small scripting adapter that calls Delphi `System.SysUtils.StrToBool`. The Delphi terminal calls `TryStrToBool`; that routine first calls the global-format overload of `TryStrToFloat`, then lazily initialises and searches `TrueBoolStrs` and `FalseBoolStrs` only when numeric parsing fails. An unrecognised value causes `StrToBool` to raise `EConvertError`.

**Edge cases and quirks**

- Numeric parsing precedes named-value matching. Values such as `-1`, `2.5` or `1E3` are therefore valid and return `True`; this is broader than accepting only `True` and `False`.
- The numeric path uses Delphi's process-global `FormatSettings`, not the fresh Windows system-locale settings used by Velox [`StrToFloat`](StrToFloat.md). A decimal string can consequently be interpreted differently by the two public functions if those settings differ.
- The installed Delphi parser recognises `NAN`, `INF`, `+INF` and `-INF` as floating special values. They enter the numeric path; the current non-zero comparison produces `True`. Avoid using special floating values as Boolean input.
- Named values are case-insensitive but are not trimmed by the Boolean-name comparison. Numeric parsing accepts its own leading/trailing-space grammar; a spaced named value such as `" true "` is not a match.
- `TrueBoolStrs` and `FalseBoolStrs` are mutable process-wide arrays. Empty arrays are populated lazily with `True` and `False`; host customisation can add other accepted names.

**Side effects**

The first non-numeric Boolean conversion can initialise the two process-wide Boolean string arrays. The function does not change Velox data or module state.

**Performance and concurrency**

Work is linear in the input and configured-name lengths. Numeric parsing reads shared global format settings, and named parsing can lazily mutate shared arrays, so this Delphi overload is not a fully isolated thread-local conversion.

**Related entries**

- [`StrToBoolDef`](StrToBoolDef.md) returns a caller-supplied fallback for unrecognised text.
- [`TryStrToBool`](TryStrToBool.md) reports conversion success separately from the parsed value.
- [`StrToFloat`](StrToFloat.md) exposes Velox's system-locale floating parser directly.

**External references**

- [Free Pascal `StrToBool`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtobool.html) - compatible numeric/named Boolean reference; Free Pascal does not prove the mutable-array or locale details of the Delphi terminal.
- [Embarcadero `System.SysUtils.StrToBool`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToBool) - the Delphi terminal selected by the Velox adapter.

<small>Created 2026-07-15</small>
