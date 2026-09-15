---
title: LoadFromStream
description: Replaces object values from a borrowed current-position stream after BOM-aware parsing and object-type validation.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, object, stream, parsing]
---

```Delphi
procedure LoadFromStream(const aStream: TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Payload: TJSONObject;
  Input: TStringStream;
begin
  Payload := TJSONObject.Create;
  Input := TStringStream.Create('{"reference":"DEMO-1001"}');
  try
    Payload.LoadFromStream(Input);
    Value := Payload['reference'].AsString;
  finally
    Input.Free;
    Payload.Free;
  end;
end;
```

### Usage

`LoadFromStream` replaces object values from a borrowed current-position stream after BOM-aware parsing and object-type validation.

### Additional Technical Info
`LoadFromStream` borrows `aStream` and begins at its current position. It does not free the stream. The Unicode decorator detects UTF-8, UTF-16 or UTF-32 BOMs and otherwise defaults to UTF-8. Parsing advances the supplied stream through the consumed value.

Nil input, end-of-stream or an otherwise empty decoded value leaves existing fields and null state unchanged. Malformed input or a first value that is not an object raises before the old fields are erased, so the previous graph is retained on those failures.

After a valid object has been parsed completely, the target frees its old children, copies source name/null state and deep-clones every parsed child. All prior borrowed references become invalid. A later allocation/clone failure has no rollback and can leave a partially populated new target.

Only the first JSON value is consumed semantically; trailing input is not rejected. Object parsing accepts duplicate names but requires quoted names, colons and correct comma/closing-brace delimiters. Shared scalar parser defects remain in force.

Use [`LoadFromString`](LoadFromString.md) when deliberate member-fragment wrapping is required. Do not reuse the stream without accounting for its advanced position.

**External references**

- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStream.Position)
- [Free Pascal `TStream.Position`](https://www.freepascal.org/docs-html/rtl/classes/tstream.position.html) - compatible current-position context.
- [RFC 8259 section 8.1: Character encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-20</small>
