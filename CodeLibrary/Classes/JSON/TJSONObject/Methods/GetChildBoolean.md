---
title: GetChildBoolean
description: Reads a non-null value one object level down or returns the required default when either path component is unavailable.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, child, boolean]
---

```Delphi
function GetChildBoolean(const aChildObjectName, aName: String;
  const aDefault: Boolean): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString(
    '{"options":{"enabled":true}}');
  try
    Value := Payload.GetChildBoolean('options', 'enabled', False);
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetChildBoolean` reads a non-null value one object level down or returns the required default when either path component is unavailable.

### Additional Technical Info
`GetChildBoolean` performs exactly two case-insensitive, side-effect-free lookups. The first field must be an actual `TJSONObject`; the second must exist and be non-null. The method returns `aDefault` when the outer field is missing, null or not an object, or when the inner field is missing or null.

The default argument is required by the PascalScript declaration. No field is created on a miss because both levels use `FindValue` rather than the default `Values` property.

For a native `TJSONBoolean`, the stored value is returned. Any other non-null node is converted by comparing its `AsString` case-insensitively with `true`. Every other representation—including `'false'`, `'1'`, `'yes'`, arrays and objects—returns `False`, not `aDefault`, because the non-null path was present.

Duplicate names resolve to the first physical match at each level. The returned Boolean has no ownership implications.

**External references**

- [RFC 8259 section 3: JSON Boolean literals](https://www.rfc-editor.org/rfc/rfc8259#section-3)
- [Embarcadero `SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)

<small>Created 2026-07-20</small>
