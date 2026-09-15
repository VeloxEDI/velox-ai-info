---
title: "RemoveLineBreaks"
description: "Removes every CRLF pair and every remaining LF character while preserving lone carriage returns."
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - line-breaks
  - newline
---

```Delphi
Function RemoveLineBreaks( aInputString : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RemoveLineBreaks('First' + #13#10 + 'Second' + #10 + 'Third');
  // FirstSecondThird
end;
```

### Usage

`RemoveLineBreaks` removes every CRLF pair and every remaining LF character while preserving lone carriage returns.

**Important behavior and quirks**

- A lone `#13` is preserved. Classic-Mac or malformed CR-only line endings therefore remain in the result.
- Adjacent lines are concatenated directly. Use [`EncodeLineBreaks`](EncodeLineBreaks.md) when a visible separator is required.
- Unicode line separator U+2028, paragraph separator U+2029 and other control characters are unchanged.
- Empty input returns empty. The source is not mutated.

### Additional Technical Info
`RemoveLineBreaks` removes Windows CRLF pairs and Unix-style LF characters. It does not remove an isolated carriage return (`#13`). No separator is inserted where a line ending was removed.

The example is fictional and source-reviewed only.

**How it works**

Velox performs two case-sensitive replace-all passes:

1. replace every `#13#10` pair with empty text; then
2. replace every remaining `#10` with empty text.

The first pass matters because it removes the carriage return that belongs to a Windows line ending. The second pass handles lone line feeds.

**Performance and concurrency**

The complete string is scanned and potentially allocated twice. The function is otherwise stateless.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatibility context.

<small>Created 2026-07-15</small>
