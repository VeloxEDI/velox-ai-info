---
title: "AddGS1128"
description: "Concatenates a GS1 application-identifier string and value without validation or separators."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - barcode
  - gs1-128
  - application-identifier
---

```Delphi
Function AddGS1128( const aApplicationIdentifier, aValue : string) : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := AddGS1128('17', '270630'); // '17270630'
end;
```

### Usage

`AddGS1128` concatenates a GS1 application-identifier string and value without validation or separators.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aApplicationIdentifier` | `string`, `const` | Text to place first. The function does not require digits, a recognised GS1 application identifier or any particular length. |
| `aValue` | `string`, `const` | Text to append immediately after the identifier. It is not trimmed, padded, escaped or validated. |

**Returns**

The exact concatenation `aApplicationIdentifier + aValue`. If both arguments are empty, the result is an empty string. If one is empty, the other is returned unchanged by value.

**Behaviour**

Round brackets commonly used to display GS1 application identifiers in human-readable text are not added to encoded element strings. The example therefore produces `17270630`, not `(17)270630`.

The caller must decide whether a following element needs an FNC1 separator. This function never inserts one. Fixed-length and variable-length application identifiers have different separator requirements, so blindly concatenating several results can produce ambiguous or invalid data.

**Important usage notes**

- Leading and trailing spaces, control characters, existing brackets and existing separators are preserved.
- The function accepts any text, including an unknown identifier, an invalid value or a value whose length conflicts with GS1 rules.
- The historical function name contains `GS1128`; the current symbology name is GS1-128.
- The result is only element-string text. It contains no ReportBuilder start character or initial FNC1 and does not render a barcode.

**Errors**

Velox does not deliberately raise, catch, log or translate an error. A memory-allocation failure from the Velox runtime can propagate.

### Additional Technical Info
`AddGS1128` joins an application-identifier string and its data value exactly as supplied. It is a low-level string helper, not a GS1 element-string validator or encoder.

**Implementation**

Velox registers the function directly in the common scripting import. Its terminal implementation performs one Delphi string concatenation and has no conditional branch, validation or error handling.

**Side effects**

The function allocates and returns string data only. It does not modify either input or any report object.

**Performance and concurrency**

Time and result storage are linear in the combined string length. The function uses no shared state and is re-entrant; normal managed-string allocation still applies.

**Related entries**

- `StartGS1128A`, `StartGS1128B` and `StartGS1128C` prepend ReportBuilder's manual start and FNC1 controls.
- [`CheckSum`](CheckSum.md) calculates a check digit when the application-identifier data structure requires one.

**External references**

- [GS1 Application Identifiers](https://ref.gs1.org/ai/?lang=en)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)

<small>Created 2026-07-15</small>
