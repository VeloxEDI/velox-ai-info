---
title: EndUpdate
description: Ends one TStrings update level and emits the descendant's final update transition when the nesting count reaches zero.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, endupdate, notifications, counter]
---

```Delphi
procedure EndUpdate;
```

### Example

```Delphi
procedure AddPairSafely(const Items: TStringList);
begin
  Items.BeginUpdate;
  try
    Items.Add('Code=100');
  finally
    Items.EndUpdate;
  end;
end;
```

### Usage

`EndUpdate` ends one TStrings update level and emits the string list's final update transition when the nesting count reaches zero.

- Never call it speculatively. Pair it structurally in `finally` after a successful begin.
- An exception from the final change event propagates with the count already zero.
- Ending a batch does not commit or validate the mutations made within it.

### Additional Technical Info
`EndUpdate` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It must be called exactly once for each successful [`BeginUpdate`](BeginUpdate.md).

#### Source-backed behaviour

The installed RTL decrements the internal counter first. If the result is zero it calls virtual `SetUpdateState(False)`; `TStringList` uses that transition to issue its final changed notification.

There is no balance guard. Calling `EndUpdate` at zero makes the count `-1`; later `BeginUpdate` sees a nonzero count, skips entry notification and increments back to zero, leaving the list outside the normal state sequence. Further mismatches can suppress notifications indefinitely.

#### Related members

[`BeginUpdate`](BeginUpdate.md) starts the nesting level. [`AddStrings`](AddStrings.md), [`Exchange`](Exchange.md) and [`Move`](Move.md) already balance their own internal batches.

#### Official RTL references

- [Embarcadero: TStrings.EndUpdate](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.EndUpdate)
- [Free Pascal: TStrings.EndUpdate](https://www.freepascal.org/docs-html/rtl/classes/tstrings.endupdate.html)

<small>Created 2026-07-15</small>
