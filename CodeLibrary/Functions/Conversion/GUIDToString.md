---
title: "GUIDToString"
description: "Formats a TGUID in Delphi's standard braced hexadecimal representation."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - guid
  - identifier
  - hexadecimal
---

```Delphi
function GUIDToString(const Guid: TGUID): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Id: TGUID;
begin
  Id := StringToGUID('{00112233-4455-6677-8899-AABBCCDDEEFF}');
  Value := GUIDToString(Id);
end;
```

### Usage

`GUIDToString` formats a TGUID in Velox's standard braced hexadecimal representation.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Guid` | `TGUID`, `const` | GUID record to format. |

**Returns**

Uppercase hexadecimal text in this layout:

```text
{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}
```

The all-zero GUID is returned as `{00000000-0000-0000-0000-000000000000}`.

**Errors**

String-allocation failures can propagate. There is no invalid-record error because every `TGUID` bit pattern has a textual representation.

**Usage notes**

Use the braced form when interoperating with Velox APIs that expect the standard `GUIDToString`/`StringToGUID` pair. Confirm another system's required brace, case and hyphen rules before building keys from GUID text.

### Additional Technical Info
`GUIDToString` converts a typed `TGUID` value to Delphi's conventional 38-character braced and hyphenated hexadecimal representation.

The example round-trips a fictional GUID. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript SysUtils import forwards to the exact `System.SysUtils.GUIDToString(const TGUID)` terminal. Delphi formats the record fields into the standard braced layout; no Velox-specific parsing or byte rearrangement occurs.

**Edge cases and quirks**

- Braces are part of the result. A consumer requiring the 36-character unbraced form must remove them explicitly.
- Hexadecimal letters are uppercase in the current Delphi implementation. GUID comparison should normally be performed on typed values or case-insensitive canonical text rather than on arbitrary spelling.
- The function formats every possible 128-bit record value; it does not test whether the GUID exists in a registry, database or Velox configuration.
- GUID field display follows the conventional textual field order. Do not treat the displayed character pairs as a raw memory dump on little-endian systems.

**Side effects**

None outside allocation of the returned string.

**Performance and concurrency**

Fixed-size formatting with no shared mutable state or locale dependency.

**External references**

- [Embarcadero `System.SysUtils.GUIDToString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.GUIDToString) - the exact Delphi terminal used by Velox.
- [Free Pascal `GUIDToString`](https://www.freepascal.org/docs-html/rtl/sysutils/guidtostring.html) - compatible representation reference; Velox executes the Delphi implementation.

<small>Created 2026-07-15</small>
