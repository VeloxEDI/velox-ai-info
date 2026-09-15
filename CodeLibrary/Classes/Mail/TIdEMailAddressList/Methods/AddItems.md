---
title: AddItems
description: Appends field copies of every source address item, treating nil as a no-op and self-copy as duplication of the original entries.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, collection, copy, append]
---

```Delphi
procedure AddItems(AList: TIdEMailAddressList);
```

### Example

```Delphi
procedure MergeRecipients(const Target, Source: TIdEMailAddressList);
begin
  if Target <> Source then
    Target.AddItems(Source);
end;
```

### Usage

`AddItems` appends field copies of every source address item, treating nil as a no-op and self-copy as duplication of the original entries.

### Additional Technical Info
`AddItems` appends a new owned item for each entry present in `AList` at loop start, then calls `Assign` to copy its raw `Address` and `Name` fields.

| Parameter | Meaning |
|---|---|
| `AList` | Borrowed source list. Nil is accepted and produces no change. |

The method does not clear the destination. Existing entries remain before the appended copies. Source item objects are not transferred, reparented or retained; later edits to either list are independent.

Copying `Address` and `Name` directly preserves those two Strings more faithfully than round-tripping through formatted `Text`. Derived `User`, `Domain` and `Text` naturally reflect the copied fields.

Passing the destination itself is permitted by the exact loop behavior. Delphi evaluates the original upper bound before iteration, so the method appends one copy of each originally present item and doubles `Count`; it does not loop forever. This is rarely intentional and can duplicate every recipient, so guard as shown.

The operation is non-transactional. Each iteration adds a blank destination item before assigning it. If allocation, collection notification or assignment raises, previous copies remain and the current newly added item can remain blank/partial. Nil is the only explicit no-op case.

Time and additional storage are O(n) in source count and copied text length. A very large or self-copied list can expand message headers and recipients substantially. Neither list may be modified concurrently; source deletion/reordering during the loop is unsupported.

The source-reviewed example prevents accidental self-duplication. It was not executed and sends no recipients.

**External references**

- [Indy upstream: `TIdEMailAddressList.AddItems`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - append-and-assign implementation.
- [Embarcadero DocWiki: `System.Classes.TPersistent.Assign`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TPersistent.Assign) - Delphi assignment protocol used by each item.
- [Free Pascal: `TPersistent.Assign`](https://www.freepascal.org/docs-html/rtl/classes/tpersistent.assign.html) - compatible assignment context; current Indy override defines the copied fields.

<small>Created 2026-07-15</small>
