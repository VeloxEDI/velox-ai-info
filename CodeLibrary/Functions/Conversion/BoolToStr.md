---
title: "BoolToStr"
description: "Converts a Boolean to numeric or configured Boolean text through Delphi's SysUtils rules."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - boolean
  - text
  - sysutils
---

```Delphi
function BoolToStr(B: Boolean; UseBoolStrs: Boolean): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := BoolToStr(True, False);  // '-1'
end;
```

### Usage

`BoolToStr` converts a Boolean to numeric or configured Boolean text through Velox's SysUtils rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `B` | `Boolean` | Value to format. |
| `UseBoolStrs` | `Boolean` | `False` selects `-1` or `0`. `True` selects the first configured true or false string. |

**Returns**

| `B` | `UseBoolStrs` | Result |
|---|---|---|
| `True` | `False` | `-1` |
| `False` | `False` | `0` |
| `True` | `True` | `TrueBoolStrs[0]`, initially `True` unless changed by the host process |
| `False` | `True` | `FalseBoolStrs[0]`, initially `False` unless changed by the host process |

**Errors**

Normal string allocation and any script-side argument conversion failures propagate. The RTL routine does not signal an invalid Boolean because `B` is already typed as `Boolean`.

**Usage notes**

Use `UseBoolStrs = False` for a stable Velox numeric representation. For an interchange contract that requires `true`/`false`, `Y`/`N` or another exact token, select it explicitly in script rather than relying on shared across the Velox process Boolean strings.

### Additional Technical Info
`BoolToStr` uses Delphi's Boolean-to-string rules. `UseBoolStrs` selects either fixed numeric text or the first entries in Delphi's process-wide Boolean-string arrays.

The example requests the deterministic numeric form. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript SysUtils import forwards to `System.SysUtils.BoolToStr(Boolean, Boolean)`. With `UseBoolStrs = False`, the selected Delphi overload uses fixed simple strings. With `UseBoolStrs = True`, it ensures the global `TrueBoolStrs` and `FalseBoolStrs` arrays have defaults when empty, then reads element zero from the applicable array.

**Edge cases and quirks**

- Delphi's numeric text for `True` is `-1`, not `1`.
- The text form is not guaranteed to remain the English literal `True` or `False`. Host code can replace or reorder the process-wide arrays.
- Initialisation of empty Boolean-string arrays and later host mutation are shared process state. Treat a configured text result as environment-dependent.
- The function does not accept a `Variant` directly. Normal PascalScript parameter conversion must first produce a `Boolean`; unsupported values can fail before the call.

**Side effects**

With `UseBoolStrs = True`, the Delphi routine can initialise empty global Boolean-string arrays. It does not modify Velox flow data or configuration directly.

**Performance and concurrency**

The conversion is constant-time apart from string allocation. The numeric form uses no configurable shared text. The configured form reads, and can initialise, process-wide arrays; concurrent host mutation is outside the call's control.

**External references**

- [Embarcadero `System.SysUtils.BoolToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.BoolToStr) - documents the exact selected Delphi overload and its global arrays.
- [Free Pascal `BoolToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/booltostr.html) - compatible behaviour reference; Velox executes the Delphi RTL implementation.

<small>Created 2026-07-15</small>
