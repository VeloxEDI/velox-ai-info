---
title: LoadFromStream
description: Parses one array from the borrowed stream's current position and deep-replaces content only after an array result.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, array, stream, parse]
---

```Delphi
procedure LoadFromStream(const aStream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Values: TJSONArray;
  Input: TMemoryStream;
begin
  Values := TJSONArray.Create;
  Input := TMemoryStream.Create;
  try
    StringToStreamUTF8('[1,2,3]', Input);
    Input.Position := 0;
    Values.LoadFromStream(Input);  // Input remains caller-owned.
    Value := Values.Count;
  finally
    Input.Free;
    Values.Free;
  end;
end;
```

### Usage

`LoadFromStream` parses one array from the borrowed stream's current position and deep-replaces content only after an array result.

### Additional Technical Info
`LoadFromStream` borrows `aStream`, begins at its current `Position` and advances it while parsing one JSON value. It never frees or rewinds the supplied stream. A Unicode decorator detects UTF-8, UTF-16LE/BE and UTF-32LE/BE BOMs at that position and otherwise defaults to UTF-8.

If the stream reference is `nil`, the current position is already at end, or parsing produces no value, the method returns without changing existing items. If the first parsed value is not an array it raises `EJSONError` and preserves existing items. Ordinary syntax/conversion errors also occur before replacement and preserve the prior array.

After a valid array has been parsed, the target erases its children, copies the parsed array's base state and deep-clones every parsed item; the temporary parse tree is then freed. Existing borrowed item references are invalidated. An allocation/clone failure after erase can leave a partial replacement.

The parser does not require the stream to end after the first value. Trailing bytes can remain unread/ignored. Its array grammar also accepts missing commas, a trailing comma and EOF without a closing bracket. It does not decode `\uXXXX` escapes (the text becomes `uXXXX`), and exponent notation such as `1e3` is incorrectly routed to integer conversion. Decimal parsing uses Delphi locale-sensitive `StrToFloat`, even though JSON requires a dot. Parsed empty objects are accepted but later serialize as `}` rather than `{}`.

For strict external input, validate size, encoding and RFC 8259 syntax with an approved boundary before using this loader. Do not treat absence of an exception as proof that the original text was conforming JSON.

**External references**

- [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible stream context; Velox executes Deltics/Delphi code.

<small>Created 2026-07-20</small>
