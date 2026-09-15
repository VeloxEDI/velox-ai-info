---
title: AddInt64
description: Adds a full signed 64-bit integer while returning hidden TJSONNumber with no usable generic JSON surface in typed scripts.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, addint64, int64, integer, return-type]
---

```Delphi
function AddInt64(const aName: String;
  const aValue: Int64): TJSONNumber;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONObject;
begin
  Document := TJSONObject.Create;
  try
    Document.AddInt64('sequence', StrToInt64('5000000000'));
    Value := Document.AsString;
  finally
    Document.Free;
  end;
end;
```

### Usage

`AddInt64` adds a full signed 64-bit integer while returning hidden TJSONNumber with no usable generic JSON surface in typed scripts.

### Additional Technical Info
`AddInt64` creates a `TJSONInteger`, assigns its name and full signed 64-bit payload, then transfers the node to the receiver. It preserves values outside the 32-bit `Integer` range and serializes them as base-10 digits without locale separators.

The return declaration is a usability defect. It exposes hidden `TJSONNumber`, which the compiler importer incorrectly places beneath `TObject` rather than `TJSONValue`. A result variable therefore has no `Value`, `AsInt64`, `Name`, `IsNull` or other JSON members, and it is not compiler-compatible with `TJSONValue`. Ignore the result or retrieve the inserted node from its parent through a generic `TJSONValue` property.

The parent owns the concrete integer node, regardless of the limited declared result type. Removal, erase/reload or parent destruction frees it. Script arithmetic and upstream conversions must still produce an in-range signed `Int64`; `StrToInt64` and similar conversion errors occur before insertion.

Serialization uses Delphi Int64-to-decimal conversion and is exact across the signed range. JavaScript and some JSON consumers cannot exactly represent all such integers as binary64 numbers, so preserve them as text when the downstream system has a 53-bit safe-integer limit. Allocation/insertion failures propagate, and final insertion failure can leak the newly created node.

**External references**

- [Embarcadero `IntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.IntToStr)
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible Int64 formatting context.
- [RFC 8259 section 6: Number interoperability](https://www.rfc-editor.org/rfc/rfc8259#section-6)

<small>Created 2026-07-15</small>
