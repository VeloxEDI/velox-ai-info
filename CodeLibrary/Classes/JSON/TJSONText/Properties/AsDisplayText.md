---
title: AsDisplayText
description: Returns a fully materialized CRLF-formatted object or array while retaining uneven indentation and serializer defects.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, asdisplaytext, formatting, pretty-print, crlf]
---

```Delphi
property AsDisplayText: String read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
  Lines: TJSONArray;
begin
  Document := TJSONObject.Create;
  try
    Document.AddString('reference', 'DEMO-1001');
    Lines := Document.AddArray('lines');
    Lines.AddInteger(1);
    Lines.AddInteger(2);
    Value := Document.AsDisplayText;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AsDisplayText` returns a fully materialized CRLF-formatted object or array while retaining uneven indentation and serializer defects.

### Additional Technical Info
`AsDisplayText` recursively formats the actual `TJSONObject` or `TJSONArray` into one Delphi String. It always uses CRLF line endings. It is a presentation serializer, not a standards validator or canonicalizer, and it does not modify the tree.

Empty containers have special forms: an array is `[ ]`; an object is `{\r\n\r\n}`. The latter avoids compact object's `}` defect. Nonempty objects indent fields by two spaces per level. Array formatting is uneven: root scalar items start at column zero, null items receive two literal leading spaces, and nested arrays/objects receive an extra two-space prefix plus their recursive indentation.

For every array child, display formatting checks `IsNull` before `ValueType`. A null-marked String created by [`AddNull`](../Methods/AddNull.md), zero DateTime or zero GUID therefore renders as `null`; compact array output instead sees `jsString` and emits `""`. Choosing display output can change the represented value.

String values use the same partial encoder as compact output: quote, backslash and five named controls are escaped, while other U+0000-U+001F characters remain raw. Object field names are inserted without any escaping. Duplicate names/order are preserved. Numbers retain locale-sensitive Double formatting, 15-digit precision and non-finite-token risks.

A semantic object/array null cannot be represented because native `TJSONText.IsNull` always returns false and native `NotNull` always returns true. Assigning `IsNull=True` only changes an inherited private bit that these getters and the serializers ignore. The Velox script runtime misbinds `NotNull` to the `IsNull` helper, so scripts read false from both properties; use `not Document.IsNull` instead. The fallback text `Not a JSON text Value` exists for an invalid/corrupt raw ancestor, but normal constructible instances are arrays or objects.

Formatting uses repeated String concatenation and materializes the complete result. Deep or large trees can consume substantial temporary memory and stack depth; cyclic graphs are not normally constructible through the cloning/ownership API. Concurrent mutation is unsafe.

**External references**

- [RFC 8259 section 2: Insignificant whitespace](https://www.rfc-editor.org/rfc/rfc8259#section-2)
- [RFC 8259 section 7: String escaping](https://www.rfc-editor.org/rfc/rfc8259#section-7)

<small>Created 2026-07-15</small>
