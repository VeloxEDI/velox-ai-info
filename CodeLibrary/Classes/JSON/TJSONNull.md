---
title: TJSONNull
description: Represents a semantic JSON null whose parent serialization is literal null although its inherited AsString is blank.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, 'null', scalar, parsing]
---

```Delphi
TJSONNull = class(TJSONValue)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Item: TJSONValue;
begin
  Values := TJSONArray.Create;
  try
    Values.LoadFromString('[null]');
    Item := Values[0];  // Borrowed TJSONNull node.
    Value := (Item.ValueType = jsNull) and Item.IsNull;
  finally
    Values.Free;
  end;
end;
```

### Usage

`TJSONNull` represents a semantic JSON null whose parent serialisation is literal null although its AsString is blank.

### Additional Technical Info
`TJSONNull` is the concrete node produced when the Deltics reader parses the JSON literal `null`. It reports `ValueType = jsNull`, overrides `IsNull` to always return `True` and has no class-specific generated properties or methods.

The inherited virtual [`Create`](TJSONValue/Methods/Create.md) constructor is callable and creates a semantic null immediately. A directly created node belongs to the script, but the generated array/object surface does not expose the generic native method required to insert that existing node. In practice, array `TJSONNull` instances normally come from parsed input. `TJSONArray.AddNull` instead creates a null-marked `TJSONString`, which the array defect serializes as `""`.

The native `DoGetAsString` implementation returns `null`, but inherited [`AsString`](TJSONValue/Properties/AsString.md) tests `IsNull` first and therefore returns `''`. Do not use standalone `AsString` as the serialized form. A parent array recognizes `jsNull`, and a parent object recognizes `IsNull`; both emit the correct unquoted literal `null` for a real `TJSONNull`.

Null state cannot be changed semantically. Writing `IsNull := False`, `AsString`, or another inherited conversion can only change the hidden base flag; the overridden getter still reports true, `AsString` remains blank and parent output remains `null`. `Clear` is likewise idempotent.

The native class overrides `NotNull` to return `False`, but PascalScript does not call that getter: its runtime registration mistakenly binds `NotNull` to the `IsNull` helper. Scripts consequently see both `IsNull = True` and `NotNull = True`. Use `not Item.IsNull`, never `Item.NotNull`.

`Clone` creates another `TJSONNull` and copies its case-sensitive `Name`. `IsEqual` compares type, name and blank `AsString`, so null nodes with the same name compare equal.

**External references**

- [RFC 8259 section 3: JSON values and the null literal](https://www.rfc-editor.org/rfc/rfc8259#section-3)

<small>Created 2026-07-20</small>
