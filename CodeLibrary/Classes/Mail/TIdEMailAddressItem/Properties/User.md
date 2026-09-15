---
title: User
description: Reads the local part before the last at-sign but replaces content through the first at-sign when writing an unvalidated user component.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, local-part, user, at-sign]
---

```Delphi
property User: string read write;
```

### Example

```Delphi
procedure RedirectMailbox(const Item: TIdEMailAddressItem);
begin
  if Item.Address = 'old@example.invalid' then
    Item.User := 'new';
end;
```

### Usage

Reads the local part before the last at-sign but replaces content through the first at-sign when writing an unvalidated user component.

### Additional Technical Info
`User` is Indy's name for the local part of [`Address`](Address.md). It is computed on demand and is not a separately stored field.

The getter scans backward to the last `@` and returns everything before it. If there is no at-sign it returns empty. Thus `a@b@c` reads as `a@b`, not `a`.

The setter searches from the start for the first `@`. If found, it deletes the original prefix through that at-sign and writes `new-user@remaining-suffix`. If no at-sign is present, it keeps the entire original address as the suffix. Exact examples are:

| Starting `Address` | Assignment | Resulting `Address` |
|---|---|---|
| `old@example` | `User := 'new'` | `new@example` |
| `example` | `User := 'new'` | `new@example` |
| empty | `User := 'new'` | `new@` |
| `a@b@c` | `User := 'new'` | `new@b@c` |
| `old@example` | `User := ''` | `@example` |

Because read and write choose different at-signs, malformed multiple-at addresses are asymmetric. Normalize to one valid at-sign before modifying the component.

No local-part syntax validation occurs. The setter accepts whitespace, quotes, dots in invalid positions, control characters, Unicode and empty content. It does not escape or quote the new value; [`Text`](Text.md) decides later how to format it and has its own period shortcut. It leaves [`Name`](Name.md) unchanged.

"User" does not imply an operating-system or Velox account and performs no identity lookup. Treat it only as an address-string component. Internationalized local parts need an explicit end-to-end SMTPUTF8 policy.

Reads scan O(n); writes allocate a replacement String. No network or mailbox I/O occurs. The item is mutable, collection-owned and not thread-safe.

The source-reviewed example guards on a known simple address before replacement and uses the reserved `.invalid` domain.

**External references**

- [Indy upstream: `IdEMailAddress.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - exact `GetUsername` and `SetUsername` behavior.
- [RFC 5322 section 3.4.1](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4.1) - normative local-part grammar not enforced here.
- [RFC 6532](https://www.rfc-editor.org/rfc/rfc6532.html) - internationalized local-part/header context.

<small>Created 2026-07-15</small>
