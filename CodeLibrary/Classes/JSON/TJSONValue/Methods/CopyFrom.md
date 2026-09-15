---
title: CopyFrom
description: Replaces a JSON value from an exact-compatible source without runtime type validation or transactional rollback.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, copy, ownership, type-safety]
---

```Delphi
procedure CopyFrom(const aSource: TJSONValue);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, Target: TJSONString;
begin
  Source := TJSONString.Create;
  Target := TJSONString.Create;
  try
    Source.Name := 'status';
    Source.Value := 'ready';
    Target.CopyFrom(Source);  // Use the same concrete runtime class.
    Value := Target.AsString;
  finally
    Target.Free;
    Source.Free;
  end;
end;
```

### Usage

`CopyFrom` replaces a JSON value from an exact-compatible source without value type validation or transactional rollback.

### Additional Technical Info
| Parameter | Meaning |
|---|---|
| `aSource` | Existing non-nil JSON value with the same concrete runtime class as the receiver. It remains owned by its current owner. |

`CopyFrom` is virtual and is an exact-class copy operation, not a conversion. The base implementation copies only the private stored null flag and exact case-preserving `Name`; it deliberately does not replace immutable [`ValueType`](../Properties/ValueType.md). Scalar overrides then use unchecked Delphi casts to copy their native payload. Object and array overrides erase the receiver and deep-clone source children.

There is no runtime compatibility check. Passing nil is invalid. Passing a different descendant can read unrelated object memory as Boolean, number, managed String or owning-list state. Outcomes range from wrong data through managed-value corruption and access violations. Comparing `ValueType` is insufficient because both integer and Double nodes report `jsNumber`; ensure the concrete creation path/class is the same. Prefer [`Clone`](Clone.md) when a new exact-compatible destination is wanted.

Container replacement is destructive and non-transactional. Existing owned children are freed before all source children have been cloned. Allocation or clone failure leaves the receiver empty or partially populated, and every prior borrowed child reference is invalid. `Target.CopyFrom(Target)` is especially hazardous for an object or array: it erases itself, then sees no source children, producing an empty container. Scalar self-copy is harmless.

Successful copying preserves duplicate object names, physical order, descendant concrete classes, retained scalar payload and stored null flags. Container `IsNull` getters still remain fixed false even though the hidden base flag is copied. Complexity is constant for scalars and linear/recursive for a complete container tree. No locking or concurrent-mutation protection is provided.

<small>Created 2026-07-15</small>
