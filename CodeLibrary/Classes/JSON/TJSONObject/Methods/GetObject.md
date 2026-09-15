---
title: GetObject
description: Returns the first matching borrowed object only on its assigned branch; missing and null paths leave the function result undefined.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, lookup, defect]
---

```Delphi
function GetObject(const aName: String): TJSONObject;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload, Detail: TJSONObject;
  Item: TJSONValue;
begin
  Payload := TJSONObject.CreateFromString('{"detail":{"status":"ready"}}');
  try
    Item := Payload.FindValue('detail');
    if Assigned(Item) and not Item.IsNull and (Item.ValueType = jsObject) then
    begin
      Detail := Payload.GetObject('detail');
      Value := Detail['status'].AsString;
    end;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`GetObject` returns the first matching borrowed object only on its assigned branch; missing and null paths leave the function result undefined.

### Additional Technical Info
`GetObject` checks the first case-insensitive name match and, when that value is non-null, returns its checked `AsObject` cast. The returned child is borrowed and owned by this object; never free it separately or retain it after deletion, erase, replacement or parent destruction.

The implementation has no `else` assignment. When the name is missing or its first value is null, the class-reference function result is left uninitialized rather than explicitly set to nil. Do not call this method as a nil-returning existence test. Use the guarded `FindValue`/`ValueType` pattern shown in the example.

A present non-null value of any other type raises a checked-cast exception. Duplicate names select the first physical match, so a later object does not help when an earlier same-name value is null or another type.

The initial `Contains` check is side-effect-free and short-circuits, so a missing name does not trigger the mutating default `Values` getter. The defect is the unassigned result, not a hidden insertion.

**External references**

- [Embarcadero class-reference types](https://docwiki.embarcadero.com/RADStudio/Florence/en/Class_References)
- [Free Pascal class references](https://www.freepascal.org/docs-html/ref/refse40.html) - compatible class-reference context.

<small>Created 2026-07-20</small>
