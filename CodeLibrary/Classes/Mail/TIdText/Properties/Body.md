---
title: Body
description: Exposes the live internally owned text-line list while assignment copies into it, with destructive self-assignment and no ownership transfer.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, text-part, body, strings, ownership]
---

```Delphi
property Body: TStrings read write;
```

### Example

```Delphi
procedure ReplaceBody(const Part: TIdText);
begin
  Part.Body.BeginUpdate;
  try
    Part.Body.Clear;
    Part.Body.Add('First line');
    Part.Body.Add('Second line');
  finally
    Part.Body.EndUpdate;
  end;
end;
```

### Usage

`Body` gives access to the text part's live list of lines. Assignment copies lines into that list; do not assign `Body` to itself because that clears the content.

### Additional Technical Info
`Body` is an internally owned `TStringList` exposed through `TStrings`.

The getter returns the live borrowed list. Mutations such as `Add`, `Clear`, indexed Strings and Text immediately change the part. Do not free the list or retain it after the part/message is destroyed.

The setter does not replace the list reference. It calls `FBody.Assign(AStrs)`, clearing/copying strings, core TStrings settings and associated object references. The supplied list remains caller-owned. Nil/incompatible assignment raises.

**Do not assign Body to itself.** In current Delphi `TStrings.Assign`, source and destination identity is not guarded: it clears the destination and then adds from the now-empty source. `Part.Body := Part.Body` therefore empties Body.

Assignment is clear-first and non-transactional; failure can leave a cleared or partial body. Associated objects, if present, are copied as borrowed references because the internal `TStringList` does not own objects. Typical mail bodies should use strings only.

The list stores logical lines, not original wire bytes or line-ending provenance. Serializing Text uses its current LineBreak/TrailingLineBreak behavior. Charset/transfer metadata does not convert the Strings.

The body resides fully in memory. Assignment/text serialization allocate proportional to total content; edits and callbacks are not thread-safe.

The source-reviewed example edits the live list in a balanced update block and was not sent.

**External references**

- [Indy upstream: `TIdText.SetBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdText.pas) - owned-list assignment.
- [Embarcadero DocWiki: `System.Classes.TStrings.Assign`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Assign) - Delphi clear/copy terminal.
- [Free Pascal: `TStrings.Assign`](https://www.freepascal.org/docs-html/rtl/classes/tstrings.assign.html) - compatibility context; Velox uses the traced Delphi implementation.

<small>Created 2026-07-15</small>
