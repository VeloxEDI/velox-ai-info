---
title: ErrorStr
description: Raises an EParserError using supplied message text and the parser's current one-based source line.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, parser, error, exception, message, source-line]
---

```Delphi
procedure ErrorStr(Message: string);
```

### Example

```Delphi
procedure RequireAssignment(Parser: TParser);
begin
  if Parser = nil then Exit;

  if Parser.Token <> '=' then
    Parser.ErrorStr('An assignment operator was expected');
end;
```

### Usage

`ErrorStr` raises an EParserError using supplied message text and the parser's current one-based source line.

### Additional Technical Info
`ErrorStr` reports a parser failure with caller-supplied text. For a parser created through Velox's exposed constructor, it raises `EParserError` whose message combines `Message` with the current one-based [`SourceLine`](../Properties/SourceLine.md).

The native implementation can first invoke an OnError callback and allow that callback to mark the error handled. Velox does not expose the constructor overload or property needed to install that callback, so a script-created parser follows the raising path.

Calling ErrorStr does not advance, reset or free the parser. If the caller catches the exception, the same current [`Token`](../Properties/Token.md) remains selected. Continuing after a semantic error is only safe if the script has an explicit recovery strategy, such as consuming to a known delimiter. Otherwise let the exception abort the parse.

`Message` is not a format string and receives no substitutions. Do not include secrets or complete confidential payloads: exception text can reach mapping errors, logs or support diagnostics. An empty message is accepted but still produces the native parse-error wrapper and line number.

Prefer this method over the exposed [`Error(Integer)`](Error.md), whose importer declaration is incompatible with current Delphi overloads.

The example is source-reviewed only; no exception was raised.

**External references**

- [Embarcadero: `TParser.ErrorStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TParser.ErrorStr) - native explicit-message error path.
- [Free Pascal: `TParser.ErrorStr`](https://www.freepascal.org/docs-html/rtl/classes/tparser.errorstr.html) - compatible parser-error behavior.

<small>Created 2026-07-15</small>
