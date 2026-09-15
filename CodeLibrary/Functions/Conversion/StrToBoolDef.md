---
title: "StrToBoolDef"
description: "Converts recognised numeric or Boolean text, returning a supplied Boolean when conversion fails."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - boolean
  - default
  - delphi
---

```Delphi
function StrToBoolDef(const S: string; const Default: Boolean): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToBoolDef('not-set', False);  // False
end;
```

### Usage

`StrToBoolDef` converts recognised numeric or Boolean text, returning a supplied Boolean when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Numeric or named Boolean text. Numeric zero is false and any non-zero numeric value is true; names are matched case-insensitively. |
| `Default` | `Boolean` | Value returned only when neither numeric parsing nor configured Boolean-name matching succeeds. |

**Returns**

The parsed Boolean on success; otherwise `Default`.

**Errors**

Ordinary conversion failure is swallowed and replaced with `Default`. Allocation failures or unexpected runtime failures are not converted into the fallback.

**Usage notes**

Choose a fallback only when losing the difference between invalid input and that Boolean value is acceptable. Configuration validation normally benefits from `TryStrToBool` because it preserves this distinction.

### Additional Technical Info
`StrToBoolDef` applies the same numeric and named-Boolean rules as [`StrToBool`](StrToBool.md), but returns `Default` instead of raising when `S` is not recognised. This makes malformed input indistinguishable from a successful conversion whose result equals the fallback.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox adapter calls Delphi `System.SysUtils.StrToBoolDef`. The terminal delegates to `TryStrToBool`, which tries the global-format floating parser before searching the process-wide `TrueBoolStrs` and `FalseBoolStrs` arrays. It assigns `Default` only when that complete conversion sequence returns `False`.

**Edge cases and quirks**

- `Default` is not used merely because `S` is an unfamiliar name if the same text is a valid number. For example, `StrToBoolDef('2', False)` returns `True`.
- The installed Delphi floating parser also recognises `NAN`, `INF`, `+INF` and `-INF`; these take the numeric path and currently produce `True`, not `Default`.
- Numeric locale behaviour comes from shared Delphi `FormatSettings`, whereas named matching uses the process-wide case-insensitive Boolean arrays.
- Named strings are not trimmed before comparison. Case is ignored, but additional whitespace prevents a named match.
- A returned value equal to `Default` does not reveal whether parsing succeeded. Use [`TryStrToBool`](TryStrToBool.md) when that distinction matters.

**Side effects**

The first non-numeric call can lazily initialise the process-wide Boolean string arrays. No Velox record, module or external resource is changed.

**Performance and concurrency**

The conversion is linear in the input and configured-name lengths. It reads global locale state and can initialise shared name arrays, so concurrent host changes to those globals can affect results.

**Related entries**

- [`StrToBool`](StrToBool.md) raises for unrecognised text.
- [`TryStrToBool`](TryStrToBool.md) returns an explicit success flag.
- [`StrToFloatDef`](StrToFloatDef.md) provides an analogous fallback for locale-aware floating text.

**External references**

- [Free Pascal `StrToBoolDef`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtobooldef.html) - compatible fallback contract, with dialect-specific Boolean-name and locale implementation.
- [Embarcadero `System.SysUtils.StrToBoolDef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToBoolDef) - the Delphi terminal selected by Velox.

<small>Created 2026-07-15</small>
