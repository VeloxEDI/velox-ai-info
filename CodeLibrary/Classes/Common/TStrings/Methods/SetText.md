---
title: SetText
description: Replaces all entries by splitting a null-terminated PChar into lines under the current TStrings line-break rules.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, settext, pchar, line-splitting]
---

```Delphi
procedure SetText(Text: PChar);
```

### Example

```Delphi
procedure ReplaceLines(const Items: TStringList);
begin
  Items.SetText('Alpha'#13#10'Beta');
end;
```

### Usage

`SetText` replaces all entries by splitting a null-terminated PChar into lines under the current TStrings line-break rules.

- Prefer assigning [`Text`](../Properties/Text.md) for managed-string code.
- The operation replaces rather than appends and is not rollback-safe after `Clear`.
- Line splitting can allocate many entries; bound externally sourced text.

### Additional Technical Info
`SetText` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is the pointer-oriented setter behind the safer managed [`Text`](../Properties/Text.md) property.

#### Source-backed behaviour

The RTL converts the PChar to the text-setter path inside a balanced update. Existing entries are cleared first. With the default platform line break, CRLF, lone LF and lone CR are all accepted as line terminators; CRLF is consumed as one boundary. A trailing line break does not add a final empty entry, and nil/empty input clears the list.

Because the input is null-terminated, embedded `#0` ends the visible text. The current importer passes script text as `PChar`; it does not expose a length parameter.

#### Related members

[`GetText`](GetText.md) allocates a PChar and has no exposed safe deallocator. [`Text`](../Properties/Text.md) joins and replaces using the same line semantics.

#### Official RTL references

- [Embarcadero: TStrings.SetText](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.SetText)
- [Free Pascal: TStrings.SetText](https://www.freepascal.org/docs-html/rtl/classes/tstrings.settext.html)

<small>Created 2026-07-15</small>
