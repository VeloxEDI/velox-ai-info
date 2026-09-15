---
title: IsNull
description: Reads or writes scalar null state while fixed container and JSON-null getters ignore the stored flag.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, 'null', state, scalar]
---

```Delphi
property IsNull: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := 'retained';
    Item.IsNull := True;
    Value := Item.IsNull;  // True; Text.Value remains retained.
  finally
    Text.Free;
  end;
end;
```

### Usage

`IsNull` reads or writes scalar null state while fixed container and JSON-null getters ignore the stored flag.

### Additional Technical Info
For an ordinary Boolean, String or correctly initialized numeric value, `IsNull` reads/writes a private flag separate from the payload and [`Name`](Name.md). Setting true does not erase the stored value; it makes null-aware [`AsString`](AsString.md) blank and causes an enclosing object to emit JSON `null`. Setting false reveals the retained payload again. Assigning a valid scalar payload normally sets the flag false automatically.

Two class families override only the getter:

- `TJSONNull.IsNull` always returns `True`. Writing false changes hidden base storage but has no visible effect.
- `TJSONText` (therefore objects and arrays) always returns `False`. Writing true changes hidden base storage but the public getter and null-aware serialization still read false. Containers cannot represent semantic null through this property.

Thus the property is not a generic reset operation. Use [`Clear`](../Methods/Clear.md) to follow runtime-class behavior, and use a real `TJSONNull` child when JSON null is required. Array serialization has additional null-marked scalar defects documented by the scalar/container pages.

The PascalScript [`NotNull`](NotNull.md) registration is wrong and calls this same reader. Both script properties return the same Boolean; write `not Item.IsNull` for a non-null test. State access is constant-time and unsynchronized. A parent-owned child remains borrowed regardless of null state.

**External references**

- [RFC 8259 section 3: JSON null](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-15</small>
