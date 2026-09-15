---
title: "EmptyGuid"
description: "Returns the all-zero GUID_NULL value as a TGuid record."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - empty
  - null-guid
  - tguid
---

```Delphi
Function EmptyGuid: TGuid
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := EmptyGuid;
  Value := IsEmptyGuid(Identifier); // True
end;
```

### Usage

`EmptyGuid` returns the all-zero GUID_NULL value as a TGuid record.

**Returns**

A value copy of `GUID_NULL`, equivalent to `{00000000-0000-0000-0000-000000000000}` when formatted by Velox `GUIDToString`.

**Important usage notes**

- An empty GUID is still a syntactically valid GUID value and can be stored or formatted.
- It does not carry a database null flag. [`GUIDToSQL`](GUIDToSQL.md) quotes it as a zero-GUID literal rather than returning SQL `NULL`.
- It is not evidence that a variable was never initialized; application code can intentionally assign the same all-zero value.
- Do not compare a formatted string manually when [`IsEmptyGuid`](IsEmptyGuid.md) can compare the record directly.

### Additional Technical Info
`EmptyGuid` returns Delphi's `GUID_NULL` constant: a 16-byte `TGuid` record whose every field and byte is zero. It is a sentinel value, not a null reference, unassigned variable, empty string or SQL `NULL`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The common import binds directly to `vxCommon.EmptyGuid`. The function consists of `Result := GUID_NULL`. There is no allocation, parsing, operating-system call or lazy initialization.

**Value structure**

`TGuid` comprises `D1: LongWord`, `D2: Word`, `D3: Word` and `D4: array[0..7] of Byte`. `GUID_NULL` sets all of them to zero. Returning the record copies those 16 bytes into the caller's value.

**Side effects and errors**

None. The function reads a compile-time/RTL constant and cannot fail under ordinary execution.

**Performance and concurrency**

Constant-time 16-byte value return with no shared mutable state.

**Related entries**

- [`IsEmptyGuid`](IsEmptyGuid.md) tests for this exact value.
- [`EmptyGuidString`](EmptyGuidString.md) returns its standard 38-character text.
- [`SafeStringToGuid`](SafeStringToGuid.md) maps exact empty input to this value.

**External references**

- [Embarcadero `System.SysUtils.IsEqualGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IsEqualGUID) - documents the equality terminal used by the companion test.
- [Free Pascal `IsEqualGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/isequalguid.html) - compatible GUID equality context.

<small>Created 2026-07-15</small>
