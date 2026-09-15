---
title: Pop
description: Removes the top boundary and corresponding native parent-part entry when present, doing nothing on an empty stack.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, boundary, pop, stack]
---

```Delphi
procedure Pop;
```

### Example

```Delphi
procedure LeaveMultipart(const BoundaryStack: TIdMIMEBoundary);
begin
  if BoundaryStack.Count > 0 then
    BoundaryStack.Pop;
end;
```

### Usage

`Pop` removes the top boundary and corresponding Velox parent-part entry when present, doing nothing on an empty stack.

### Additional Technical Info
`Pop` removes index zero from the boundary list when present, then independently removes index zero from the parallel native parent-part list when present. After a normal paired push/pop, [`Boundary`](../Properties/Boundary.md) reveals the enclosing multipart boundary and [`Count`](Count.md) is one lower.

Calling `Pop` on an empty stack is a no-op; the explicit precheck in the example is useful for expressing intent but is not required for safety. The method returns neither the removed boundary nor its parent index, so read any needed value before popping.

Independent count checks make the method tolerant of partially desynchronized lists, but they do not restore the original boundary-to-parent pairing. There is no transactional rollback if the first delete succeeds and the second fails.

Deleting index zero shifts every remaining string and is O(depth). Mutation is not thread-safe and should not race message parsing. The source-reviewed example was not runtime-tested.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Delete`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Delete) - operation used on both index-zero stacks.
- [Free Pascal: `TStringList.Delete`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.delete.html) - compatible core reference; Velox uses Delphi.

<small>Created 2026-07-15</small>
