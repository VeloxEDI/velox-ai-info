---
title: OptBoolean
description: Returns the required default for a missing or null field and otherwise applies Velox's permissive true-only Boolean conversion.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, optional, boolean]
---

```Delphi
function OptBoolean(const aName: String;
  const aDefault: Boolean): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"enabled":true}');
  try
    Value := Payload.OptBoolean('enabled', False);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`OptBoolean` returns the required default for a missing or null field and otherwise applies Velox's permissive true-only Boolean conversion.

### Additional Technical Info
`OptBoolean` performs a side-effect-free, case-insensitive `FindValue` lookup. The PascalScript declaration requires `aDefault`, which is returned only when the first matching field is absent or its node is null.

A native `TJSONBoolean` returns its stored value. Every other non-null node is converted by comparing `AsString` case-insensitively with `true`. Therefore `'true'` returns `True`, while `'false'`, `'yes'`, `'1'`, any number and structured text return `False` rather than the supplied default.

The method does not create a missing null field. Duplicate names select the first physical occurrence. To distinguish an explicit invalid representation from false, inspect the node and `ValueType` with `FindValue` before conversion.

**External references**

- [RFC 8259 section 3: JSON Boolean literals](https://www.rfc-editor.org/rfc/rfc8259#section-3)
- [Free Pascal `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatible comparison context.

<small>Created 2026-07-20</small>
