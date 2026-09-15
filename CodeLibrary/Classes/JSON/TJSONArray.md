---
title: TJSONArray
description: Builds and parses a mutable owning JSON array whose child lifetime and permissive parser require defensive use.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, parsing, ownership]
---

```Delphi
TJSONArray = class(TJSONText)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Detail: TJSONObject;
begin
  Values := TJSONArray.Create;
  try
    Values.AddString('DEMO-1001');
    Values.AddInteger(2);
    Detail := Values.AddObject;  // Borrowed; Values owns it.
    Detail.AddString('status', 'ready');
    Value := Values.AsString;
  finally
    Values.Free;
  end;
end;
```

### Usage

`TJSONArray` builds and parses a mutable owning JSON array whose child lifetime and permissive parser require defensive use.

### Additional Technical Info
`TJSONArray` is the mutable JSON array implementation registered for Velox scripts. Its inherited virtual [`Create`](TJSONValue/Methods/Create.md) constructor dispatches to the native array constructor, which creates an owning object list. A directly created top-level array belongs to the script and must be freed. A child returned by another JSON node is normally owned by that parent and must not be freed separately.

Every appended node becomes owned by the array. [`Delete`](TJSONArray/Methods/Delete.md), [`DeleteValue`](TJSONArray/Methods/DeleteValue.md), [`Erase`](TJSONArray/Methods/Erase.md) and destruction free affected nodes, invalidating all retained references to them and their descendants. The array is mutable and not thread-safe.

The generated array-specific surface consists of:

- construction: [`AddArray`](TJSONArray/Methods/AddArray.md), [`AddBoolean`](TJSONArray/Methods/AddBoolean.md), [`AddDatetime`](TJSONArray/Methods/AddDatetime.md), [`AddGUID`](TJSONArray/Methods/AddGUID.md), [`AddInteger`](TJSONArray/Methods/AddInteger.md), [`AddNull`](TJSONArray/Methods/AddNull.md), [`AddObject`](TJSONArray/Methods/AddObject.md), [`AddString`](TJSONArray/Methods/AddString.md) and [`AddText`](TJSONArray/Methods/AddText.md);
- mutation/search: [`Combine`](TJSONArray/Methods/Combine.md), `Delete`, `DeleteValue`, `Erase` and [`FindObject`](TJSONArray/Methods/FindObject.md);
- parsing: [`LoadFromStream`](TJSONArray/Methods/LoadFromStream.md) and [`LoadFromString`](TJSONArray/Methods/LoadFromString.md); and
- access: [`Count`](TJSONArray/Properties/Count.md) and default indexed [`Items`](TJSONArray/Properties/Items.md).

The PascalScript importer also declares `AddEnum(value, typeInfo)` and `Sort(comparer)`, but no pages for them exist in the generated tree or `_Index.json`; the comparer type is not declared by this importer. Treat those as an unresolved registration/generator surface, not a supported documented contract, until the product registration is repaired and regenerated.

#### Serialization quirks

Inherited [`AsString`](TJSONValue/Properties/AsString.md) produces compact array text in insertion order. Strings escape quote, backslash, backspace, tab, line feed, form feed and carriage return. Other U+0000-U+001F controls are emitted raw, contrary to JSON grammar, so a string containing them can produce invalid output.

`AddNull` does not create `TJSONNull`; it creates a null-marked `TJSONString`. The array serializer branches on node type without first testing `IsNull`, so that value becomes `""` rather than `null`. Zero `TDateTime` and an all-zero GUID follow the same faulty path. Parse or build a real `TJSONNull` through a valid input array when an actual null is required.

Nested objects carry separate serializer defects. An empty `TJSONObject` removes its opening brace while attempting to remove a trailing comma and therefore emits `}` rather than `{}`. Object field names are inserted between quotes without escaping quote, backslash or controls. Populate objects with validated safe names, and do not expect parsed empty objects to round-trip.

#### Parser quirks

The parser supports BOM-detected UTF-8/UTF-16/UTF-32 input and otherwise defaults to UTF-8, but it is deliberately permissive and incomplete. Array parsing accepts missing commas, a trailing comma and end-of-stream without a closing `]`; it also stops after the first parsed value without rejecting trailing input. JSON `\uXXXX` escape decoding is marked TODO and does not reconstruct the Unicode code point. Parsed empty objects are accepted but later serialize through the defective `}` path.

`LoadFromString` automatically wraps a nonempty value whose first character is not `[`. Because it checks before trimming, leading whitespace before an already bracketed array creates another outer array. Validate JSON with a standards-compliant boundary when strict syntax, signatures or interoperability matter.

Names on array children are ignored during array serialization. Numeric double/Int64 array adders are not part of the generated array-specific surface. Use the documented exact methods and verify the resulting `AsString` before sending externally.

**External references**

- [RFC 8259: The JavaScript Object Notation data interchange format](https://www.rfc-editor.org/rfc/rfc8259)
- [Embarcadero `TObjectList`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Contnrs.TObjectList)
- [Free Pascal `TObjectList`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.html) - compatible owning-list context; Velox executes the traced Delphi/Deltics implementation.

<small>Created 2026-07-20</small>
