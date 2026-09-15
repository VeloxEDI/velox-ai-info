---
title: Erase
description: Frees every owned field while retaining the same always-non-null object instance and its name.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, erase, ownership]
---

```Delphi
procedure Erase;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.CreateFromString('{"temporary":true}');
  try
    Payload.Erase;
    Payload.AddString('status', 'ready');
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`Erase` frees every owned field while retaining the same always-non-null object instance and its name.

### Additional Technical Info
`Erase` clears the owning value list. Every child and descendant is freed, `ValueCount` becomes zero and all previously borrowed child references become invalid.

The `TJSONObject` instance remains allocated and can be repopulated. Its inherited `Name` is unchanged. `Erase` does not write the private base null bit, but objects always read `IsNull=False` and serialize their fields regardless of that storage. Virtual inherited `Clear` dispatches to the object override, which calls this same method; unlike scalar `TJSONValue.Clear`, it cannot make the object semantically null. Script `NotNull` is misbound and reads false, so use `not Payload.IsNull` when a positive predicate is required.

An erased object immediately serializes through the known empty-object defect as `}` rather than `{}`. Add at least one valid field before emitting it, or handle empty output at a standards-compliant boundary.

Erasing an already empty object is safe. The method is not thread-safe and must not race with readers or writers holding child references.

**External references**

- [Embarcadero `TObjectList.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.Clear)
- [Free Pascal `TObjectList`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.html) - compatible ownership context.

<small>Created 2026-07-20</small>
