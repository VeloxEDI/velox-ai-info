---
title: Clear
description: Clears a JSON value using its runtime class's null-marking or owned-child erasure behaviour.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, clear, 'null', ownership]
---

```Delphi
procedure Clear;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
begin
  Text := TJSONString.Create;
  try
    Text.Value := 'retained';
    Text.Clear;
    Value := Text.IsNull;  // True; Text.Value still contains retained.
  finally
    Text.Free;
  end;
end;
```

### Usage

Clears a JSON value using its runtime class's null-marking or owned-child erasure behaviour.

### Additional Technical Info
`Clear` is virtual. On an ordinary scalar descendant, the base implementation sets the stored null flag to `True`; it does not erase [`Name`](../Properties/Name.md) or the class-specific payload. `TJSONString.Value`, `TJSONBoolean.Value` and the native numeric fields therefore retain their previous data even though null-aware [`AsString`](../Properties/AsString.md) becomes blank. Assigning a valid payload later normally clears null state and reveals/replaces the stored value.

Runtime dispatch materially changes the operation for containers. `TJSONArray.Clear` and `TJSONObject.Clear` call their `Erase` implementation, freeing every owned child and invalidating all borrowed child references. They do not invoke the base null marker or change `Name`; their null reader always returns `False`. `TJSONNull` has no payload and always reports null, so clearing it is semantically idempotent.

The receiver remains allocated. A directly created receiver remains script-owned; clearing a parent-owned child never transfers ownership. The operation is synchronous and has no locking. Container clearing is linear in child count and recursively releases descendant trees; scalar clearing is constant-time.

No exception is expected for a live scalar. Container destruction/finalization failures are not suppressed. A nil or already freed script object cannot be used. Because the script [`NotNull`](../Properties/NotNull.md) property is misregistered, verify the result with `IsNull`, not `NotNull`.

**Related entries**

- [`IsNull`](../Properties/IsNull.md)
- [`CopyFrom`](CopyFrom.md)
- [`TJSONArray.Erase`](../../TJSONArray/Methods/Erase.md)
- [`TJSONObject.Erase`](../../TJSONObject/Methods/Erase.md)

<small>Created 2026-07-15</small>
