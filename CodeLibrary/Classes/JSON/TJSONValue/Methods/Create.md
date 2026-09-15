---
title: Create
description: Initializes a supported concrete JSON descendant and rejects construction of the abstract TJSONValue ancestor.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, constructor, value-type, ownership]
---

```Delphi
constructor Create;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
begin
  Text := TJSONString.Create;  // Do not call TJSONValue.Create.
  try
    Text.Value := 'ready';
    Value := Text.AsString;
  finally
    Text.Free;
  end;
end;
```

### Usage

`Create` creates an empty value for a supported JSON type. Calling it directly for `TJSONValue` raises an error; create the required JSON type instead.

### Additional Technical Info
`Create` is the virtual constructor declared by `TJSONValue` and inherited by correctly registered descendants. After `TObject` initialization it tests the actual runtime instance, in this order: array, String, Boolean, null, number, object. It stores the corresponding immutable [`ValueType`](../Properties/ValueType.md). A raw `TJSONValue` or abstract raw `TJSONText` matches none of those classes and raises `EJSONError` with `Unknown JSON value class`.

Use a concrete public constructor such as `TJSONString.Create`, `TJSONBoolean.Create`, `TJSONArray.Create` or `TJSONObject.Create`. The returned object is caller-owned until explicitly transferred to an owning container. Free a standalone value in `finally`; never separately free a child already owned by an object or array. Delphi automatically destroys a failed constructor instance, so the raw-class exception does not leave that instance allocated.

Correctly constructed String, Boolean and number storage begins at the Delphi zero value and is non-null because the stored flag is initially false. Arrays and objects begin empty and always report non-null. `TJSONNull` always reports null. The constructor does not set `Name`.

The PascalScript importer has a separate numeric ancestry defect. It registers hidden `TJSONNumber` beneath `TObject`, not `TJSONValue`, so a direct `TJSONDouble.Create` or `TJSONInteger.Create` expression can resolve to `TObject.Create` and skip this classifier. Such a typed expression also lacks the common value surface. Prefer parser/helper-created numeric nodes; see the numeric class pages for the exact limitation.

Construction is synchronous. Scalar cost is constant; object and array constructors additionally allocate their owning list. Allocation errors and `EJSONError` propagate.

**External references**

- [Embarcadero `TObject.ClassType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.ClassType)
- [Free Pascal `TObject.ClassType`](https://www.freepascal.org/docs-html/rtl/system/tobject.classtype.html) - compatible Object Pascal runtime-class context; supported-class selection is Deltics-specific.

<small>Created 2026-07-15</small>
