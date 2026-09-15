---
title: Add
description: Deliberately returns nil without creating a part, preventing construction of the prohibited base TIdMessagePart class.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, add, no-op]
---

```Delphi
function Add: TIdMessagePart;
```

### Example

```Delphi
procedure DemonstrateDisabledAdd(const Parts: TIdMessageParts;
  var Value: Variant);
begin
  Value := Parts.Add = nil;
end;
```

### Usage

`Add` deliberately returns nil without creating a part, preventing construction of the prohibited base TIdMessagePart class.

### Additional Technical Info
`Add` always returns nil and performs no insertion. `Count`, cached counters and existing items remain unchanged.

This is intentional: the collection's registered item class is `TIdMessagePart`, whose constructor raises when the runtime class is exactly the base. Concrete parts must be created by `TIdText`, attachment or mail-helper constructors that attach themselves to this collection.

Do not dereference the result and do not use this method as a generic factory. Use the owning Velox mail API appropriate to text versus file/stream attachment content.

The call is constant-time, allocation-free and thread-neutral by itself, though the borrowed collection must remain alive. The source-reviewed example documents the exact nil contract and was not executed.

**External references**

- [Indy upstream: `TIdMessageParts.Add`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - explicit nil implementation and rationale comment.

<small>Created 2026-07-15</small>
