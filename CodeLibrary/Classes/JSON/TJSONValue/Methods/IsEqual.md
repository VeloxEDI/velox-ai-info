---
title: IsEqual
description: Compares JSON kind, exact name and current AsString output rather than object identity or complete hidden state.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, equality, comparison, 'null']
---

```Delphi
function IsEqual(const aOther: TJSONValue): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  LeftValue, RightValue: TJSONString;
begin
  LeftValue := TJSONString.Create;
  RightValue := TJSONString.Create;
  try
    LeftValue.Name := 'status';
    LeftValue.Value := 'ready';
    RightValue.CopyFrom(LeftValue);
    Value := LeftValue.IsEqual(RightValue);
  finally
    RightValue.Free;
    LeftValue.Free;
  end;
end;
```

### Usage

`IsEqual` compares JSON kind, exact name and current AsString output rather than object identity or complete hidden state.

### Additional Technical Info
| Parameter | Meaning |
|---|---|
| `aOther` | Existing non-nil JSON value to compare. Ownership is unchanged. |

`IsEqual` returns true only when three expressions are equal: immutable [`ValueType`](../Properties/ValueType.md), case-sensitive [`Name`](../Properties/Name.md), and the current [`AsString`](../Properties/AsString.md) result. It does not compare object addresses, concrete runtime classes, the private null flag or a retained class-specific payload directly.

Those choices create important equivalence rules:

- a null-marked `TJSONString` and a non-null empty `TJSONString` with the same name compare equal because both expose blank `AsString`;
- cleared scalars with different retained payloads can compare equal when both expose blank text;
- integer and Double nodes share `jsNumber`, so matching formatted text can compare equal even though their actual classes differ;
- Double values that collapse to the same locale-sensitive formatted text compare equal;
- object order, duplicate fields and serializer defects affect equality because compact object text is compared;
- array item names do not affect equality because array serialization ignores them; and
- top-level names remain significant even though root serialization normally omits them.

The method has no nil guard and reads `aOther.ValueType` immediately; passing nil raises an access violation. Serialization/conversion exceptions also propagate. Container comparison constructs complete compact strings, so time and temporary memory are proportional to the serialized trees. It is not constant-time, canonical JSON comparison, structural schema comparison or safe for concurrent mutation.

Use explicit `IsNull`, concrete-class checks and field-by-field logic when null identity, numeric precision, object key order independence or duplicate handling matters.

<small>Created 2026-07-15</small>
