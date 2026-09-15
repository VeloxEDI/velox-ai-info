---
title: Value
description: Reads or replaces the retained Boolean payload and makes the JSON node non-null on assignment.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, boolean, value, 'null']
---

```Delphi
property Value: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Flag: TJSONBoolean;
begin
  Flag := TJSONBoolean.Create;
  try
    Flag.Value := True;
    Flag.Clear;
    Value := Flag.Value;  // True is retained, although Flag.IsNull is True.
  finally
    Flag.Free;
  end;
end;
```

### Usage

`Value` reads or replaces the retained Boolean payload and makes the JSON node non-null on assignment.

### Additional Technical Info
`Value` reads or writes the native Boolean stored by [`TJSONBoolean`](../../TJSONBoolean.md). A fresh node reads `False`. Assigning either `True` or `False` also sets inherited [`IsNull`](../../TJSONValue/Properties/IsNull.md) to `False`; `False` is an ordinary JSON Boolean value, not a null sentinel.

Reading this property returns the retained field directly and does not consult null state. [`Clear`](../../TJSONValue/Methods/Clear.md) or `IsNull := True` therefore leaves the last Boolean visible through `Value`, even though inherited [`AsString`](../../TJSONValue/Properties/AsString.md) is blank. Check `IsNull` before consuming the payload when null is meaningful.

When the node is non-null, a containing object or array serializes the value as the unquoted lowercase literal `true` or `false`. Setting `Value` performs no text parsing and cannot raise a conversion error.

The property does not change the node's `Name`, ownership or parent. A parent-owned node remains borrowed and must not be freed separately.

**External references**

- [RFC 8259 section 3: JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
