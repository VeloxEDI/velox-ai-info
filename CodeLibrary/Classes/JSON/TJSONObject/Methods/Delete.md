---
title: Delete
description: Removes and frees the first case-insensitive field-name match while leaving an absent name unchanged.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, delete, ownership]
---

```Delphi
procedure Delete(const aValueName: String);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"secret":"remove","status":"ready"}');
  try
    Payload.Delete('SECRET');
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`Delete` removes and frees the first case-insensitive field-name match while leaving an absent name unchanged.

### Additional Technical Info
`Delete` finds the first field whose name matches `aValueName` case-insensitively, removes that child from the owning list and frees it recursively. A missing name is a no-op.

If duplicate names exist, only the first physical match is removed. A later duplicate can then become the value returned by `FindValue`, `Values[name]` and optional getters. Repeat deletion or use indexed access when every duplicate must be removed deliberately.

Any reference to the removed node or one of its descendants becomes dangling immediately and must not be used or freed. References to later entries remain owned by the object, although their physical indexes shift down by one.

Name matching uses `SameText`; no case-sensitive deletion variant is exposed. The method does not change the object's own `Name`. Objects remain semantic non-null containers: `IsNull` reads false and serialization processes the remaining fields regardless of the inherited private null-storage bit.

**External references**

- [Embarcadero `TObjectList.Remove`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Remove)
- [Free Pascal `TObjectList.Remove`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.remove.html) - compatible owning removal context.

<small>Created 2026-07-20</small>
