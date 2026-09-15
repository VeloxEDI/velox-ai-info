---
title: AsString
description: Reads null-aware scalar text or compact JSON and writes through the concrete class's virtual parser or payload setter.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, string, serialization, conversion]
---

```Delphi
property AsString: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: TJSONString;
  Item: TJSONValue;
begin
  Text := TJSONString.Create;
  try
    Item := Text;
    Item.AsString := 'ready';
    Value := Item.AsString;
  finally
    Text.Free;
  end;
end;
```

### Usage

`AsString` reads null-aware scalar text or compact JSON and writes through the class's parser or payload setter.

### Additional Technical Info
The getter first calls virtual [`IsNull`](IsNull.md). If true, it returns `''` without reading the retained payload. Otherwise it invokes the actual class's virtual raw getter:

| Actual value | Non-null result |
|---|---|
| `TJSONString` | Raw unquoted Unicode text. |
| `TJSONBoolean` | Exact lowercase `true` or `false`. |
| `TJSONInteger` | Signed decimal text. |
| `TJSONDouble` | Locale-sensitive Delphi floating text. |
| `TJSONArray` | Complete compact array text. |
| `TJSONObject` | Complete compact object text. |
| `TJSONNull` | Always blank because its null getter is fixed true. |

Array/object output allocates the complete document and inherits all documented serializer behavior: incomplete String/control escaping, unescaped object names, physical order/duplicates, locale-sensitive Double text, the empty-object `}` defect and array null-marked-scalar inconsistencies. This property returns serialization text for a container, not a borrowed internal buffer.

The setter invokes the concrete virtual raw setter. A String stores the supplied text. Boolean accepts only case-insensitive exact `true`/`false`; integer and Double use strict Delphi conversion; those scalar setters clear null state before parsing, so an invalid assignment can raise while leaving the old payload newly non-null. `TJSONNull` only changes an invisible base flag and remains null.

For an actual `TJSONArray` or `TJSONObject`, assignment parses a complete replacement document of the matching root kind. Parsing/wrong-root failure occurs before erasing current children, so prior content is retained. A successful matching parse deep-copies the new tree and invalidates old borrowed children. Empty/whitespace-only input produces no parsed source and also retains existing children. Parsing accepts the Deltics reader's documented nonstandard behaviors and ignores trailing content after the first value.

The operation is synchronous and unsynchronized. Scalar access is constant-time apart from String allocation/conversion; container reads/writes are proportional to the complete tree/text and can allocate another parsed/copy tree. Use [`IsNull`](IsNull.md) before reading when null and empty text differ, and prefer typed properties only when the actual value contract is known.

**External references**

- [Embarcadero `UnicodeString`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.UnicodeString)
- [Free Pascal Reference Guide: multi-byte String types](https://www.freepascal.org/docs-html/current/ref/refsu10.html) - compatible UnicodeString context; Velox executes Delphi/Deltics.
- [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259)

<small>Created 2026-07-15</small>
