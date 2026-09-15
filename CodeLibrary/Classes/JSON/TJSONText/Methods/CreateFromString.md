---
title: CreateFromString
description: Uses a required ignored receiver to parse one object or array, with a default-code-page to UTF-8 mismatch for non-ASCII input.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, json, createfromstring, parsing, encoding, ownership]
---

```Delphi
function CreateFromString(const aString: String): TJSONText;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Factory, Parsed: TJSONText;
begin
  Factory := TJSONObject.Create;
  try
    Parsed := Factory.CreateFromString('{"status":"ready"}');
    try
      if Assigned(Parsed) then
        Value := Parsed.AsString;
    finally
      Parsed.Free;
    end;
  finally
    Factory.Free;
  end;
end;
```

### Usage

`CreateFromString` uses a required ignored receiver to parse one object or array, with a default-code-page to UTF-8 mismatch for non-ASCII input.

### Additional Technical Info
Native `CreateFromString` is a class function, but Velox registers it as a normal method at compile time and runtime. A script must call it through a non-nil `TJSONText`-typed receiver. The native code ignores the receiver, parses `aString` and returns a separate caller-owned object or array.

This entry has an encoding defect not present in every descendant parser. It constructs `TStringStream(aString)` using Delphi `TEncoding.Default`, which is the Windows ANSI encoding in this product, then gives the BOM-less bytes to a reader that assumes UTF-8. ASCII text is stable. Non-ASCII characters can be corrupted or rejected unless the process default code page produces the intended UTF-8 bytes. The reader also fails to validate UTF-8 continuation ranges, miscalculates four-byte sequences and reduces decoded non-BMP values to one 16-bit `Char`.

Empty/whitespace-only input returns nil. A scalar first value raises during the checked `TJSONText` cast and leaks that parsed scalar. Malformed text and numeric/conversion errors propagate; there is no `TryCreate`-style suppression.

Only the first value is consumed, so trailing text is ignored. Reader defects remain: literalized `\uXXXX`, permissive/missing array delimiters, exponent-only failure and locale-sensitive decimal conversion. The returned tree preserves duplicate object names and insertion order.

For reliable non-ASCII input, supply explicitly UTF-8/BOM-tagged bytes through [`CreateFromStream`](CreateFromStream.md) or use a concrete descendant path whose traced string implementation does not perform this ANSI-to-UTF-8 round trip. Always free both the receiver and non-nil result separately.

**External references**

- [Embarcadero `TStringStream.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringStream.Create)
- [Embarcadero `TEncoding.Default`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.Default)
- [Free Pascal `TStringStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tstringstream.create.html) - analogous stream context; encoding defaults differ from Delphi.
- [RFC 8259 section 8.1: Character encoding](https://www.rfc-editor.org/rfc/rfc8259#section-8.1)

<small>Created 2026-07-15</small>
