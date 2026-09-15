---
title: "StringToGUID"
description: "Parses supported Delphi GUID text into a TGUID record."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - guid
  - identifier
---

```Delphi
function StringToGUID(const S: string): TGUID;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGUID;
begin
  Identifier := StringToGUID(
    '{8F14E45F-CEEA-4C91-BE45-8B3146A20F10}');
  Value := GUIDToString(Identifier);
end;
```

### Usage

`StringToGUID` parses supported Velox GUID text into a TGUID record.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Exactly 38 characters in `{8-4-4-4-12}` hexadecimal form. |

**Returns**

The binary `TGUID` value represented by `S`.

**Errors**

Any shape or hexadecimal error raises `EConvertError`; no partial GUID is returned. Allocation/runtime exceptions also propagate.

**Usage notes**

Do not remove braces or accept arbitrary identifiers merely to make an input parse. Validate the integration field and handle conversion failure at the boundary where the external data enters the flow.

### Additional Technical Info
`StringToGUID` converts the canonical braced GUID text form into a `TGUID` record. It validates the complete representation and raises on malformed input.

The example parses and formats a fictional identifier. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The current modified PascalScript COM support declares and registers the installed Delphi `System.SysUtils.StringToGUID` function when interface support and the current Delphi feature define are enabled. The terminal calls installed `StrToGUID`, checks exact length, braces and hyphen positions, validates every hexadecimal pair and writes the 16 GUID bytes in Delphi field layout.

**Edge cases and quirks**

- Braces and all four hyphens are mandatory. The accepted shape is `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}`.
- Uppercase and lowercase hexadecimal digits are accepted; whitespace, prefixes, missing braces and trailing characters are not.
- Empty input and the all-zero text are different: empty input raises, while `{00000000-0000-0000-0000-000000000000}` returns the valid zero GUID.
- No locale, Unicode normalisation or case conversion is involved.
- Availability is conditional in the embedded PascalScript source, but the current Velox build exposes the function and `TGUID` type.

**Side effects**

None outside result assignment and exception allocation.

**Performance and concurrency**

The parser examines a fixed 38-character form and uses no shared mutable state. Cost is constant and calls are re-entrant.

**Related entries**

- [`GUIDToString`](GUIDToString.md) returns the matching canonical braced representation.

**External references**

- [Embarcadero `StringToGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringToGUID) - the exact Delphi core function registered by Velox.
- [Free Pascal `StringToGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/stringtoguid.html) - compatible canonical-form and failure context; Velox executes Delphi's parser.

<small>Created 2026-07-15</small>
