---
title: Comments
description: Supported comment forms and their effect on Velox script compilation.
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comments
  - pascal
---

Comments document a script and are discarded by the PascalScript compiler. Velox's current parser recognises all three familiar Object Pascal forms.

## Syntax

```Delphi
// A single-line comment ends at the line break.

{ A brace comment can span lines. }

(* A star-parenthesis comment can also span lines. *)
```

Use comments to explain intent, source assumptions, sentinel meanings and why a non-obvious Velox call is safe. Do not use them to preserve obsolete code or hide credentials, customer data or production endpoints.

## How it works

The PascalScript lexer scans `//` to the next line ending, `{` to the next `}`, and `(*` to the next `*)`. Unless a caller explicitly asks the parser to return comments, it skips the resulting comment tokens before grammar processing. Line counters still advance through multi-line comments so diagnostics retain useful positions.

Velox enables the preprocessor before compilation. Consequently, brace text that begins with a supported directive such as `{$I ...}` or `{$INCLUDE ...}` is processed as an include, not discarded as an ordinary explanatory comment.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Preserve database null; trim only assigned text.
  if not (VarIsNull(Value) or VarIsEmpty(Value) or VarIsClear(Value)) then
    Value := Trim(VarToStr(Value));
end;
```

The example is source-reviewed and explains the reason for the guard rather than restating the next line.

## Common mistakes

- Forgetting the closing `}` or `*)`; the lexer emits a comment error and stops at end-of-file.
- Expecting nested block comments. The Velox parser stops at the first matching closing delimiter and does not implement Free Pascal's nested-comment behaviour.
- Commenting out a region that already contains the same block delimiter; use line comments or remove the code cleanly.
- Treating `{$I Name}` as harmless text; it requests an include.
- Putting sensitive data in comments. Comments remain in source, logs, repositories and documentation even though they are not executed.

## Edge cases and quirks

- `//` inside a quoted string is text, not a comment, because the string token is scanned first.
- A brace comment and `(* ... *)` can span lines; a `//` comment cannot.
- Free Pascal can support nested comments in some modes, whereas Velox's current PascalScript lexer does not. The external references describe broader language behaviour and must not override the Velox rule.
- XML documentation comment conventions are not used to generate Velox Code Library metadata.

## Related reference

- **Includes** — preprocessor directives that use brace syntax.
- **Compilation errors** — unterminated comment diagnostics.

## External references

- [Free Pascal: Comments](https://www.freepascal.org/docs-html/ref/refse2.html)
- [Embarcadero DocWiki: Delphi Comments](https://docwiki.embarcadero.com/RADStudio/Athens/en/Delphi_Comments)
