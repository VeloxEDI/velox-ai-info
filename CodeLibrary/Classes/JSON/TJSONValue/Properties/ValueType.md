---
title: ValueType
description: Reports the immutable JSON kind assigned from the concrete runtime class during native value construction.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, value-type, enumeration, runtime-class]
---

```Delphi
property ValueType: TJSONValueType read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Item: TJSONValue;
begin
  Document := TJSONObject.CreateFromString('{"status":"ready"}');
  try
    Item := Document.FindValue('status');
    Value := Item.ValueType = jsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`ValueType` reports the immutable JSON kind assigned from the runtime class during Velox value construction.

### Additional Technical Info
`ValueType` is assigned once by native [`Create`](../Methods/Create.md) from the actual runtime class and has no writer. The values are:

| Value | Native class family |
|---|---|
| `jsString` | `TJSONString` |
| `jsNumber` | `TJSONInteger` and `TJSONDouble` through hidden `TJSONNumber` |
| `jsBoolean` | `TJSONBoolean` |
| `jsArray` | `TJSONArray` |
| `jsObject` | `TJSONObject` |
| `jsNull` | `TJSONNull` |

The kind is independent of [`IsNull`](IsNull.md). A null-marked `TJSONString` remains `jsString`, not `jsNull`; only a real `TJSONNull` reports `jsNull`. `Clear`, assignment, parsing into an existing matching container and `CopyFrom` do not change the receiver's kind. Use both properties when semantic null and physical representation matter.

The tag is a broad JSON kind, not an exact Delphi class check. Both integer and Double nodes report `jsNumber`, while their precision and conversion behavior differ. Checked [`AsArray`](AsArray.md), [`AsObject`](AsObject.md) and [`AsText`](AsText.md) still validate the actual object class.

The numeric importer defect creates an exception to reliable script construction: hidden `TJSONNumber` is parented beneath `TObject`, so direct typed numeric construction can skip the native classifier and leave the zero-initialized ordinal `jsString`. Parser- and helper-created numeric nodes run the native constructor and report `jsNumber`. A typed numeric script expression also lacks this inherited property; inspect a generic `TJSONValue` obtained from its parent.

Reading is constant-time, side-effect-free and unaffected by name or ownership.

**External references**

- [RFC 8259 section 3: JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-15</small>
