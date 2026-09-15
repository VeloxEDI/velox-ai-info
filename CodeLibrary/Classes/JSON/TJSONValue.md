---
title: TJSONValue
description: Defines the shared identity, conversion, naming, null-state, comparison and copying contract for Velox JSON values.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, value, conversion, 'null']
---

```Delphi
TJSONValue = class(TObject)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TJSONValue;
  Text: TJSONString;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.Name := 'status';
    Item.AsString := 'ready';
    Value := Item.Name + '=' + Item.AsString;
  finally
    Text.Free;
  end;
end;
```

### Usage

`TJSONValue` defines the shared identity, conversion, naming, null-state, comparison and copying contract for Velox JSON values.

### Additional Technical Info
`TJSONValue` is the visible common scripting type for correctly registered JSON Boolean, null, String, array and object nodes. It owns a case-preserving [`Name`](TJSONValue/Properties/Name.md), an immutable [`ValueType`](TJSONValue/Properties/ValueType.md) and a virtual payload/null interface. The actual descendant determines how conversion properties read, write, parse or serialize the payload.

The class is an ancestor, not a usable generic container. Direct [`TJSONValue.Create`](TJSONValue/Methods/Create.md) raises `EJSONError` because the constructor cannot classify a raw base instance and its payload reader is abstract. Construct a concrete class, use an object/array add method, or obtain a parser-created value. A directly constructed concrete value is caller-owned; a value obtained from a parent object or array is normally borrowed and parent-owned.

#### Generated and missing surface

The generated pages contain five methods and 21 properties. The importer also registers `AsDate`, `AsTime` and indexed `AsEnum[PTypeInfo]`, but the current generated tree contains no pages for them. They are therefore not given invented reference paths. The hidden native `TJSONNumber` ancestor is also registered incorrectly beneath `TObject`; a `TJSONDouble`- or `TJSONInteger`-typed script expression does not inherit this surface. Their class pages explain that exception.

Use the generic surface only through a `TJSONValue` expression whose actual object was correctly constructed. The checked views [`AsArray`](TJSONValue/Properties/AsArray.md), [`AsObject`](TJSONValue/Properties/AsObject.md) and [`AsText`](TJSONValue/Properties/AsText.md) return the same object and raise for the wrong actual class. Scalar conversions route through the descendant's virtual text accessors. Consequently a write can store a scalar, parse and replace a container, clear null state before a later conversion failure, or have no visible effect on `TJSONNull`.

#### Nulls and identity

For ordinary scalars, [`Clear`](TJSONValue/Methods/Clear.md) and [`IsNull`](TJSONValue/Properties/IsNull.md) change a separate flag without erasing the retained payload or name. Objects and arrays override `Clear` to erase children and override the null reader to remain non-null. `TJSONNull` always reads null. The PascalScript runtime has a registration defect: [`NotNull`](TJSONValue/Properties/NotNull.md) is bound to the `IsNull` reader, so the two script properties return the same value. Use `not Item.IsNull` when a non-null predicate is required.

[`Clone`](TJSONValue/Methods/Clone.md) creates the same runtime class and copies its state; the result is caller-owned. [`CopyFrom`](TJSONValue/Methods/CopyFrom.md) is not a cross-type conversion and has no runtime type guard. [`IsEqual`](TJSONValue/Methods/IsEqual.md) compares the kind, exact name and `AsString`, not object identity or the stored null flag.

#### Conversion boundaries

Integer and floating conversions use Delphi `System.SysUtils` routines. Floating text is locale-sensitive because no `TFormatSettings` is supplied; it is not a locale-invariant JSON-number boundary and the selected global-settings routines are not thread-safe. Date/time conversion uses ISO 8601 with the UTC flags set to true. GUID text is parsed strictly and written with braces.

`AsSQL` and `AsSQLTrim` are legacy quoted-text helpers, not SQL parameterization. Their setters contain a traced length defect and are not inverses of their getters. Prefer database parameters where available and treat every conversion property as synchronous mutable access to the same underlying node.

**External references**

- [Embarcadero `TObject.ClassType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.ClassType)
- [Free Pascal `TObject.ClassType`](https://www.freepascal.org/docs-html/rtl/system/tobject.classtype.html) - compatible runtime-class context; Velox executes the traced Delphi/Deltics implementation.
- [RFC 8259: The JavaScript Object Notation data interchange format](https://www.rfc-editor.org/rfc/rfc8259)

<small>Created 2026-07-15</small>
