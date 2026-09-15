---
title: String
description: Stores managed UnicodeString text as 1-based UTF-16 code units, distinct from ANSI Char, PChar and UTF8String aliases.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, string, unicode, utf16, managed]
---

```Delphi
String
```

### Example

```Delphi
procedure BuildLabel(Code, Name: String; var LabelText: String);
begin
  LabelText := Code + ' - ' + Name;
end;
```

### Usage

Stores managed UnicodeString text as 1-based UTF-16 code units, distinct from ANSI Char, PChar and UTF8String aliases.

### Additional Technical Info
In the current Delphi-built PascalScript compiler, public String is registered as `btUnicodeString` and backed by managed Delphi UnicodeString text.

String indexing is 1-based and Length counts UTF-16 code units, not Unicode grapheme clusters. A supplementary Unicode code point uses a surrogate pair (two positions), and a user-perceived character can contain multiple code points. Avoid cutting arbitrary international text at unchecked code-unit positions.

The public script [`Char`](Char.md) remains an 8-bit AnsiChar. Assigning a non-ASCII String code unit to Char can narrow. [`PChar`](PChar.md) is an ANSI NUL-terminated pointer, not a durable pointer to String's UTF-16 storage.

Some importer surfaces deliberately declare `UTF8String` as `AnsiString`. Those values contain encoded UTF-8 bytes, while String contains Unicode text. Use explicit UTF-8 conversion at that boundary; implicit ANSI casts can use the server code page and lose characters.

Strings are managed, reference-counted values and may contain embedded NUL characters. Assignment normally shares storage until mutation but that is an implementation detail, not an interchange contract. Do not expose their memory address or retain a PChar across changes.

Stream Read/Write methods are a special unsafe adapter: their String argument is treated as untyped bytes and is not resized or encoded. Follow those member pages; do not generalize that behavior to normal text.

The example is source-reviewed only; no String was built at runtime.

**External references**

- [Embarcadero string types](https://docwiki.embarcadero.com/RADStudio/en/String_Types_(Delphi)) - UnicodeString storage, indexing and management.
- [Free Pascal string types](https://www.freepascal.org/docs-html/ref/refch3.html) - compatible string concepts; encoding defaults differ and do not override Velox's UnicodeString registration.

<small>Created 2026-07-15</small>
