---
title: TvxField
description: Adds Velox null, sentinel, type-test and conversion helpers to live Delphi dataset fields through a stateless scripting facade.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, field, 'null', conversion, dataset, facade]
---

```Delphi
TvxField = class(TField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.IsNullEmpty then
    Field.SetIfEmpty('UNKNOWN');

  Value := Field.AsStringTrim;
end;
```

### Usage

`TvxField` adds Velox null, sentinel, type-test and conversion helpers to live Velox dataset fields through a stateless scripting facade.

### Additional Technical Info
`TvxField` is the Velox scripting facade for a live Delphi dataset field. It inherits the registered `TField` surface and adds exact tests for null/empty/zero values, conditional setters, field-type groups and convenience conversion properties.

Do not construct or free this class. Velox returns it from field-map context and dataset field lookups; the underlying object is normally a concrete Delphi field such as `TStringField`, `TIntegerField` or `TDateTimeField`.

The PascalScript import exposes thirteen methods and seven read/write properties. It does not register the native constructor.

**Facade implementation**

Velox applies a static `TvxField` cast to ordinary `TField` descendants. `TvxField` deliberately contains no instance data: source comments record that an earlier stateful design caused access violations because the real object had not been allocated with a `TvxField` layout. Current helpers operate only through inherited virtual properties and existing field state.

The static cast does not change the object's runtime class. Virtual access such as `AsDateTime` still dispatches through the actual field descendant; unsupported conversions can raise.

**Helper groups**

| Purpose | Members |
|---|---|
| Exact null | [`Null`](TvxField/Methods/Null.md), [`NotNull`](TvxField/Methods/NotNull.md) |
| Blank text | [`IsNullEmpty`](TvxField/Methods/IsNullEmpty.md), [`NotNullEmpty`](TvxField/Methods/NotNullEmpty.md), [`SetIfEmpty`](TvxField/Methods/SetIfEmpty.md) |
| Null/zero sentinel | [`IsNullZero`](TvxField/Methods/IsNullZero.md), [`NotNullZero`](TvxField/Methods/NotNullZero.md), [`SetIfZero`](TvxField/Methods/SetIfZero.md) |
| Conditional null replacement | [`SetIfNull`](TvxField/Methods/SetIfNull.md) |
| Hard-coded field groups | [`IsDateType`](TvxField/Methods/IsDateType.md), [`IsNumericType`](TvxField/Methods/IsNumericType.md), [`IsStringType`](TvxField/Methods/IsStringType.md) |
| Convenience values | [`AsDateTime`](TvxField/Properties/AsDateTime.md), [`AsFloat0`](TvxField/Properties/AsFloat0.md), [`AsInteger0`](TvxField/Properties/AsInteger0.md), [`AsStringTrim`](TvxField/Properties/AsStringTrim.md), [`AsInfo`](TvxField/Properties/AsInfo.md) |
| SQL-shaped text | [`AsSQL`](TvxField/Properties/AsSQL.md), [`AsSQLTrim`](TvxField/Properties/AsSQLTrim.md) |
| Velox explicit-null flag | [`ForceNull`](TvxField/Methods/ForceNull.md) |

The empty and zero helpers are product-defined sentinel rules, not interchangeable null tests. In particular, Boolean false and date/time value zero are zero-like, while string `'0'` is not.

**State, ownership and errors**

Every read uses the current record. Every write uses the concrete field's `Value`, `AsString`, `AsFloat`, `AsInteger` or `AsDateTime` setter and can require dataset edit state, invoke conversion/validation, mark the record modified or raise. A write does not Post, ApplyUpdates or commit anything by itself.

The owning view/dataset controls lifetime. A retained reference follows cursor movement and becomes invalid when fields are destroyed or the schema is rebuilt. Dataset buffers and field objects are not thread-safe.

**Important quirks**

- `ForceNull` only sets `Required := True`; it does not clear the field.
- Date/numeric/string membership is a fixed list and omits some newer or specialised field types.
- `AsInfo` has a labelled getter but a raw `AsString` setter.
- `AsSQL` and `AsSQLTrim` getters quote formatted display text, not a typed parameter value; both setters contain a lossy substring bug and should not be used for round trips.
- The compiler registration text for `IsNumericType` contains an extra closing parenthesis. The PascalScript parser ignores the trailing token after the completed return type and the runtime importer binds the method, so the method remains available.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) describes the actual field hierarchy, conversions and null defaults used beneath the facade.
- [Free Pascal: `TField`](https://www.freepascal.org/docs-html/fcl/db/tfield.html) provides compatible field-model context; Velox runs against Delphi's implementation.

<small>Created 2026-07-15</small>
