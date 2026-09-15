---
title: TJSONObject
description: Builds and parses an ordered owning JSON object with case-insensitive lookup, duplicate names and a mutating default getter.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, parsing, ownership]
---

```Delphi
TJSONObject = class(TJSONText)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
begin
  Payload := TJSONObject.Create;
  try
    Payload.AddString('reference', 'DEMO-1001');
    Payload.AddInteger('quantity', 2);
    Value := Payload.AsString;
  finally
    Payload.Free;
  end;
end;
```

### Usage

`TJSONObject` builds and parses an ordered owning JSON object with case-insensitive lookup, duplicate names and a mutating default getter.

### Additional Technical Info
`TJSONObject` is Velox's mutable JSON name/value container. The inherited virtual [`Create`](TJSONValue/Methods/Create.md) constructor dispatches to the native object constructor, which allocates an owning object list. A directly created top-level object belongs to the script and must be freed. Values returned from an object or array are normally borrowed and owned by their parent.

Every child is owned. [`Delete`](TJSONObject/Methods/Delete.md), [`DeleteByIndex`](TJSONObject/Methods/DeleteByIndex.md), [`Erase`](TJSONObject/Methods/Erase.md), virtual `Clear`, successful replacement and destruction free affected nodes recursively. Any retained reference to one of those nodes or descendants then becomes invalid.

The generated object-specific surface contains:

- construction/copy: [`CreateFromString`](TJSONObject/Methods/CreateFromString.md), the misregistered instance factory [`TryCreate`](TJSONObject/Methods/TryCreate.md), [`Clone`](TJSONObject/Methods/Clone.md) and [`Combine`](TJSONObject/Methods/Combine.md);
- lookup/mutation: [`Contains`](TJSONObject/Methods/Contains.md), `Delete`, `DeleteByIndex`, `Erase`, [`FindValue`](TJSONObject/Methods/FindValue.md) and [`GetObject`](TJSONObject/Methods/GetObject.md);
- optional values: [`OptBoolean`](TJSONObject/Methods/OptBoolean.md), [`OptDateTime`](TJSONObject/Methods/OptDateTime.md), [`OptDouble`](TJSONObject/Methods/OptDouble.md), [`OptInteger`](TJSONObject/Methods/OptInteger.md) and [`OptString`](TJSONObject/Methods/OptString.md);
- nested values: [`GetChildBoolean`](TJSONObject/Methods/GetChildBoolean.md), [`GetChildDateTime`](TJSONObject/Methods/GetChildDateTime.md), [`GetChildDouble`](TJSONObject/Methods/GetChildDouble.md), [`GetChildInteger`](TJSONObject/Methods/GetChildInteger.md) and [`GetChildString`](TJSONObject/Methods/GetChildString.md);
- parsing: [`LoadFromStream`](TJSONObject/Methods/LoadFromStream.md) and [`LoadFromString`](TJSONObject/Methods/LoadFromString.md); and
- access: [`ValueByIndex`](TJSONObject/Properties/ValueByIndex.md), [`ValueCount`](TJSONObject/Properties/ValueCount.md) and default [`Values`](TJSONObject/Properties/Values.md).

The importer also declares `OptEnum`, `OptDate`, `OptTime`, `GetChildEnum`, `GetChildDate` and `GetChildTime`, but no pages for them exist in the generated tree or `_Index.json`. Treat them as an unresolved registration/generator surface until regeneration produces governed paths; do not infer their contract from the class page alone.

#### Names, duplicates and lookup side effects

Names are matched with `SameText`, so lookup is case-insensitive and returns the first physical match. Parsing and `Combine` allow duplicate names, and serialization emits all duplicates in insertion order.

The default `Values[name]` property is not observational on a miss. It creates and owns a null-marked `TJSONString` under the requested spelling, increases `ValueCount` and changes output to include that name as `null`. Use `FindValue` or `Contains` when checking without mutation. All returned child references are borrowed.

#### Serialization defects

Inherited `AsString` produces compact insertion-order output, but an object with no values serializes as `}` rather than `{}` because the serializer unconditionally removes what it assumes is a trailing comma. Objects always read `IsNull=False`; assigning `IsNull=True` changes only hidden base storage and does not suppress this output. Always-populated objects avoid the empty-object defect.

Field names are inserted between quotes without escaping quote, backslash or control characters. String values use the shared encoder, which still leaves some U+0000-U+001F controls raw. Duplicate names are retained. Validate names and output before using the text for strict APIs, signatures or security decisions.

Objects test a child's `IsNull` before its type and therefore serialize null-marked scalar or null nodes as `null`. A nested object cannot be made semantically null because its `TJSONText.IsNull` getter is fixed false. An empty object inserted into an array instead contributes the defective compact token `}`, producing invalid text such as `[}]`; a populated object serializes its fields normally even after `IsNull=True` was assigned.

#### Parsing and conversion boundaries

The stream reader is BOM-aware and otherwise defaults to UTF-8. Object syntax requires quoted names, colons and comma/close delimiters, but duplicate names and trailing content after the first complete object are accepted. Shared parser defects include literalized `\uXXXX`, exponent-only number failure and locale-sensitive decimal conversion.

`LoadFromString` optionally wraps a member fragment but checks the first character before trimming. The constructor and `TryCreate` parse exact input instead. Although native `TryCreate` is a class function, Velox registers it as an ordinary method: a script needs a separate non-nil receiver, which the implementation ignores while constructing the returned object. Optional/nested getters return defaults only for missing/null paths; malformed non-null data can still raise. `GetObject` has an unassigned-result defect for missing/null values and must not be treated as a reliable nil-returning lookup.

The object is mutable and not thread-safe.

**External references**

- [RFC 8259: The JavaScript Object Notation data interchange format](https://www.rfc-editor.org/rfc/rfc8259)
- [Embarcadero `TObjectList`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList)
- [Free Pascal `TObjectList`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.html) - compatible owning-list context; Velox executes the traced Delphi/Deltics implementation.

<small>Created 2026-07-20</small>
