---
title: LoadFromStream
description: Erases the ancestor-typed receiver before inspecting or parsing a borrowed stream, so every later empty or failing path loses prior content.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, loadfromstream, stream, destructive, parsing]
---

```Delphi
procedure LoadFromStream(const aStream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Document: TJSONText;
  Input: TStringStream;
begin
  Document := TJSONObject.Create;
  Input := TStringStream.Create('{"status":"ready"}');
  try
    Document.LoadFromStream(Input);
    Value := Document.AsString;
  finally
    Input.Free;
    Document.Free;
  end;
end;
```

### Usage

`LoadFromStream` replaces the current value with JSON read from a stream. It clears the previous value first, so an empty stream or a read or parse failure leaves the previous content unavailable.

### Additional Technical Info
This page describes the non-virtual `TJSONText` method. PascalScript chooses it when the expression is typed `TJSONText`, as in the example. A `TJSONObject` or `TJSONArray`-typed expression can select its descendant method of the same name, whose retention/replacement sequence differs.

The ancestor implementation first calls virtual abstract `Erase`, dispatching to the actual object/array and freeing every existing child. Only then does it read `aStream.Position` and `Size`. Consequently a nil stream erases and then fails; an empty stream or current end position erases and succeeds with an empty receiver; every decoding, parsing or copy exception also occurs after old state has gone.

The stream is borrowed, not freed or rewound. Reading begins at its current position. UTF-8, UTF-16LE/BE and UTF-32LE/BE BOMs are detected; otherwise UTF-8 is assumed. The decoder does not validate UTF-8 continuation ranges, calculates four-byte UTF-8 and UTF-16 surrogate values incorrectly, and casts decoded UTF-32/non-BMP values to one 16-bit `Char`. Position advances through the first parsed value, and trailing content is left/ignored according to reader lookahead.

For a parsed value, virtual `CopyFrom` dispatches on the receiver:

- matching object/object or array/array input deep-clones children;
- object input into an array is interpreted through the shared one-list layout, retaining names internally but ignoring them in array output;
- array input into an object becomes ordered blank-name fields, usually duplicates; and
- scalar input is reinterpreted as though its first payload field were an object list, which can access invalid memory and raise an access violation or worse.

The parsed source is freed in `finally`. Recursive clone failure can still leave the receiver partly repopulated, and the base clone routines can leak partially constructed descendants. The method has no size/depth limits and is not safe for concurrent mutation.

**External references**

- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position)
- [Embarcadero `TStream.Size`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Size)
- [Free Pascal `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible stream-position context.
- [RFC 8259 section 9: Parsers](https://www.rfc-editor.org/rfc/rfc8259#section-9)

<small>Created 2026-07-15</small>
