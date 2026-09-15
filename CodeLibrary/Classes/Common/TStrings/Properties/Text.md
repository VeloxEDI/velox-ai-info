---
title: Text
description: Gets all entries joined by the current line break or replaces the list by splitting managed text into lines.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, text, linebreak, replacement]
---

```Delphi
property Text: string read write;
```

### Example

```Delphi
procedure ReplaceFromText(const Items: TStringList);
begin
  Items.Text := 'First'#13#10'Second';
end;
```

### Usage

Gets all entries joined by the current line break or replaces the list by splitting managed text into lines.

- Assignment replaces all entries and is not rollback-safe.
- Do not use Text when individual entries can contain line breaks that must round-trip unchanged.
- Large joins require a complete managed output string; large assignments can create many strings.

### Additional Technical Info
`Text` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is the normal managed-string alternative to raw [`GetText`](../Methods/GetText.md) and [`SetText`](../Methods/SetText.md).

#### Source-backed behaviour

The getter concatenates every entry with the internal `LineBreak`. Studio 37.0 defaults to the platform line break and `TrailingLineBreak=True`, so even the final entry is normally followed by a line break. The importer does not expose those two controls.

The setter begins an update, clears the list and splits text. With the default line break it recognises CRLF, lone CR and lone LF. A trailing line break does not create a final empty entry; empty text clears the list. Existing object associations are lost according to descendant ownership rules.

#### Related members

[`GetText`](../Methods/GetText.md) allocates an unmanaged PChar and should generally be avoided. [`LoadFromFile`](../Methods/LoadFromFile.md) and [`SaveToFile`](../Methods/SaveToFile.md) encode/decode this representation.

#### Official RTL references

- [Embarcadero: TStrings.Text](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Text)
- [Free Pascal: TStrings.Text](https://www.freepascal.org/docs-html/rtl/classes/tstrings.text.html)

<small>Created 2026-07-15</small>
