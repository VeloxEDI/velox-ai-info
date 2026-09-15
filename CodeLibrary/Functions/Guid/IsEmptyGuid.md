---
title: "IsEmptyGuid"
description: "Tests whether all fields of a TGuid equal GUID_NULL."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - guid
  - empty
  - comparison
  - guid-null
---

```Delphi
Function IsEmptyGuid(const aGuid: TGuid): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Identifier: TGuid;
begin
  Identifier := SafeStringToGuid('');
  Value := IsEmptyGuid(Identifier); // True
end;
```

### Usage

`IsEmptyGuid` tests whether all fields of a TGuid equal GUID_NULL.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aGuid` | `TGuid`, `const` | Binary 16-byte GUID value to compare. |

**Returns**

`True` when all fields equal `GUID_NULL`; otherwise `False`.

**Important usage notes**

- Any single nonzero bit makes the result `False`; GUID version/variant validity is irrelevant.
- The function does not recognize empty text, whitespace, SQL null or variant null because its parameter is already a `TGuid` record.
- A parsed or generated zero GUID is indistinguishable from the deliberate sentinel.
- String casing and braces do not matter after successful parsing because the comparison is binary.

### Additional Technical Info
`IsEmptyGuid` returns `True` only when a `TGuid` record is exactly equal to the all-zero `GUID_NULL` value. It compares the binary value, not a string representation.

The example is fictional, deterministic, source-reviewed and was not executed by the documentation workflow.

**Implementation**

The direct runtime pointer calls `vxCommon.IsEmptyGuid`, which returns `IsEqualGuid(aGuid, GUID_NULL)`. Installed Delphi implements `IsEqualGUID` as record equality (`Guid1 = Guid2`), so all 128 bits participate.

**Side effects and errors**

None. No allocation, operating-system call or expected exception.

**Performance and concurrency**

Constant-time fixed-record comparison with no shared mutable state.

**Related entries**

- [`EmptyGuid`](EmptyGuid.md) returns the compared constant.
- [`EmptyGuidString`](EmptyGuidString.md) renders it as text.
- [`SafeStringToGuid`](SafeStringToGuid.md) returns the empty GUID for exact empty input.

**External references**

- [Embarcadero `System.SysUtils.IsEqualGUID`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IsEqualGUID)
- [Free Pascal `IsEqualGUID`](https://www.freepascal.org/docs-html/rtl/sysutils/isequalguid.html)

<small>Created 2026-07-15</small>
