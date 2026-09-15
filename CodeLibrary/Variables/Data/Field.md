---
title: "Field"
description: "Exposes the active destination field in a field-map script through the Velox field helper surface."
sidebar_position: 105
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - field
  - map-context
---

```Delphi
Field: TvxField
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Null;
  if Field <> nil then
  begin
    if Field.NotNull then
      Value := Field.Value;
  end;
end;
```

### Usage

Exposes the active destination field in a field-map script through the Velox field helper surface.

**Behaviour and side effects**

- `Value`/`AsVariant` preserves database null as a Variant. Test `IsNull` or `Null` before conversions when null is meaningful.
- Typed properties such as `AsString`, `AsInteger`, `AsFloat` and `AsDateTime` convert according to the field class and can raise for incompatible values. Embarcadero documents typed reads of null as type defaults, so use `IsNull` when zero/empty must remain distinct.
- Assigning a value modifies the current destination record, can mark the dataset modified and can invoke field conversion/validation. It does not post or commit the record by itself.
- `Clear` sets the field null. Velox `ForceNull` does not clear it: it only sets `Required := True`, which its custom daDBExpress writer interprets with an already-null value as an explicit SQL-null instruction. Standard dataset required-field validation can instead reject that null on Post.
- Velox helpers such as `SetIfNull`, `SetIfEmpty`, `SetIfZero`, `AsStringTrim`, `AsSQL` and type tests have their own exact contracts. Follow their member pages rather than assuming ordinary Velox semantics.

**Ownership, errors and performance**

Velox owns the field and its dataset. Never free it, change structural properties such as `FieldName`/`Index` casually, or retain it after the view closes or moves to a new schema. The field value changes as the dataset cursor moves. Neither fields nor their dataset buffers are thread-safe.

Ordinary value access is constant-time, but conversions, validation, lookup/calculated field logic and downstream posting can add work or raise. The enclosing map normally catches field-mapping exceptions and logs them; the exact event determines whether later fields/records continue.

### Additional Technical Info
`Field` is the live destination field owned by the active `TvxFieldMap`. It provides the standard Delphi field value/conversion properties plus Velox's `TvxField` convenience methods. Reading or assigning it acts on the current destination record being mapped.

The reference normally points to a concrete Delphi `TField` descendant such as a string, numeric or date field. Its `DataType`, null state and current dataset edit state determine which conversions and assignments are valid.

**Binding and resolution**

Velox declares `Field` for every scripter so shared source can compile, but binds it only when the current `MapItem` is a `TvxFieldMap` within a custom map. During binding, `TvxFieldMap.Field` lazily asks the active destination `ViewMap.View` for the configured SQL field name. A missing or unsynchronised destination field can therefore fail before or while the script executes.

In a view-level map event, ordinary script item or other context, `Field` is nil/unbound. Guard it before dereferencing in reusable scriptlets. Use the event's `Value` parameter when the event contract specifically supplies one; `Field.Value` is direct access to the destination buffer and is not always interchangeable with that parameter.

**Implementation quirk**

`TvxField` is deliberately used as a script API overlay on real `TField` objects. The product does not require the runtime field to have been constructed as an actual `TvxField`. Source comments prohibit adding private instance data to `TvxField`, because the overlay would then read or write memory that does not exist in the real object; an earlier stateful `ForceNull` design caused access violations. Current helpers are safe only to the extent that they operate through inherited `TField` state and stateless methods.

`AsDateTime` statically casts `Self` to `TDateTimeField`, but inherited `TField.AsDateTime` access is virtual. The actual field descendant still controls parsing/formatting or raises an access/conversion error; the cast performs no runtime type check, but it does not by itself impose a `TDateTimeField` memory layout. Treat the concrete `DataType` and documented member behavior as authoritative.

**Related entries**

- [`Dataview`](Dataview.md) exposes the owning live view.
- [`TvxField`](../../Classes/Data/TvxField.md) documents Velox helper members.
- [`Datasets`](../../ScriptingGuide/Datasets.md) covers field null, cursor and edit rules.
- [`AfterMap (Field)`](../../ScriptingGuide/Events/AfterMap_Field.md) explains the field-level value write-back sequence.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents Delphi field values, conversions, nulls and concrete descendants.
- [Free Pascal: `TField`](https://www.freepascal.org/docs-html/fcl/db/tfield.html) provides compatible field-model context; Velox uses Delphi fields and its own overlay.

<small>Created 2026-07-15</small>
