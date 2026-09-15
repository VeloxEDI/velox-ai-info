---
title: Clear
description: Empties both internal boundary and parent-part lists so Count becomes zero and Boundary becomes an empty string.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, boundary, clear, stack]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ResetBoundaries(const BoundaryStack: TIdMIMEBoundary);
begin
  BoundaryStack.Clear;
end;
```

### Usage

`Clear` removes every tracked boundary and parent-part value. After the call, `Count` is zero and `Boundary` is an empty string.

### Additional Technical Info
`Clear` removes every entry from the internal boundary list and then every entry from the parallel parent-part list. On normal completion, [`Count`](Count.md) returns `0` and [`Boundary`](../Properties/Boundary.md) returns `''`.

The method is safe on an already-empty stack. It does not free the `TIdMIMEBoundary` object, and the same message-owned instance can be used again.

Clearing a message's live MIME boundary stack changes parser/encoder working state and cannot be undone from this object. Use it only when deliberately resetting that state, not merely to discard a borrowed reference.

The operation is non-transactional: the boundary list is cleared before the parent list. An exceptional failure or concurrent access between those operations could expose mismatched internal state. Cost is O(depth) for releasing the stored strings, and the object is not thread-safe. The source-reviewed example was not runtime-tested.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Clear`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Clear) - core operation invoked for both lists.
- [Free Pascal: `TStringList.Clear`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.clear.html) - compatible core reference; Velox uses Delphi.

<small>Created 2026-07-15</small>
