---
title: Includes
description: How Velox scriptlets are included in a script and resolved before compilation.
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - includes
  - scriptlets
  - preprocessor
---

Includes insert shared script source before compilation. Velox enables the PascalScript preprocessor and resolves an include from the map's Global Script, configured scriptlets or the local Velox Scripts folder.

## Syntax

```Delphi
{$I CommonDates}

procedure ScriptEvent(var Value: Variant);
begin
  Value := NormaliseDateText(VarToStr(Value));
end;
```

`{$INCLUDE CommonDates}` is the long form. The source-reviewed example assumes the included scriptlet defines `NormaliseDateText`.

## Resolution order

For an include request, the current scripter callback performs:

1. Ignore a request for the calling file itself or the scripter's `Main` file, preventing direct self-inclusion.
2. If the requested name is exactly `Global Script`, return the Global Script text assigned from the current map.
3. Look up a configured scriptlet by name. When found, return its script text and record the scriptlet in the scripter's dependency list.
4. Otherwise, combine the request with the configured Velox Scripts path and, when that file exists, read its bytes while denying concurrent writers.
5. If nothing is found or a file read fails, return empty source.

The preprocessor inserts the returned text at the directive and tracks line/file information so compiler messages can identify included modules. Nested includes are supported up to the preprocessor's configured maximum depth (20 by default).

## Scope and ordering

Included declarations behave as if their text appeared at the directive. Declarations must still appear in a syntactically legal order. Duplicate identifiers or conflicting procedure declarations fail the combined compilation. The same scriptlet can be referenced from many scripts, so changing it changes the next compilation of every dependent script.

## Errors and quirks

- The Velox callback deliberately returns success even when no source was found. A missing include therefore becomes empty text instead of the preprocessor's normal “scriptlet not found” error. The first visible error may be an unknown identifier later in the main script.
- Database scriptlets take precedence over files with the same requested name.
- File content is read into an `AnsiString` byte buffer. Keep script files in the encoding expected by the current compiler; do not assume arbitrary Unicode encodings will be decoded.
- Compiler hints from non-main modules are filtered from editor output, while errors still fail the build.
- Recursive or mutually recursive includes eventually reach the depth limit and fail preprocessing.

## Common mistakes

- Including a display label that does not exactly resolve to the configured scriptlet or filename.
- Defining the required event procedure in both the main script and an include.
- Depending on declaration order that changes when a scriptlet is edited.
- Assuming a missing include will always report “include not found”. Check the scriptlet/file and then follow unknown identifiers back to their expected include.
- Editing a shared scriptlet without reviewing every consuming map.

## Related reference

- **Scripting** — complete compilation pipeline.
- **Comments** — distinction between brace comments and directives.
- **Compilation errors** — module names and duplicate/unknown identifier failures.
