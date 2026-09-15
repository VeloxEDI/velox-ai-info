---
title: Domain
description: Reads text after the last at-sign but replaces text from the first at-sign when writing a new unvalidated domain component.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, domain, at-sign]
---

```Delphi
property Domain: string read write;
```

### Example

```Delphi
procedure RedirectDomain(const Item: TIdEMailAddressItem);
begin
  if Item.Address = 'alerts@old.example.invalid' then
    Item.Domain := 'new.example.invalid';
end;
```

### Usage

Reads text after the last at-sign but replaces text from the first at-sign when writing a new unvalidated domain component.

### Additional Technical Info
`Domain` is a computed view over [`Address`](Address.md); no separate domain field exists.

On read, the getter scans from the end of `Address` to the last `@` and returns everything after it. If no at-sign exists, it returns an empty String. A trailing at-sign also yields empty. Whitespace, brackets, comments and multiple at-signs are returned according to their raw positions without validation.

On write, the setter uses the **first** at-sign. It deletes that character and everything after it, then appends `@` plus the supplied domain. If no at-sign exists it appends to the entire raw value. Examples of exact behavior include:

| Starting `Address` | Assignment | Resulting `Address` |
|---|---|---|
| `user@old.example` | `Domain := 'new.example'` | `user@new.example` |
| `user` | `Domain := 'new.example'` | `user@new.example` |
| empty | `Domain := 'new.example'` | `@new.example` |
| `a@b@c` | `Domain := 'new.example'` | `a@new.example` |
| `user@old.example` | `Domain := ''` | `user@` |

The last-at read and first-at write differ deliberately in code, making malformed multiple-at input asymmetric. Establish one valid local part and one at-sign before using this property.

The setter does not lowercase, trim, validate label lengths, reject whitespace or convert an internationalized domain to ASCII. It also leaves [`Name`](Name.md) unchanged. [`Text`](Text.md) is formatted from the resulting raw state and may not produce a valid deliverable mailbox.

Domain comparisons elsewhere in the class family are inconsistent by operation: [`AddressesByDomain`](../../TIdEMailAddressList/Methods/AddressesByDomain.md) uses case-insensitive locale-aware comparison, while [`SortByDomain`](../../TIdEMailAddressList/Methods/SortByDomain.md) uses case-sensitive locale-aware order. Normalize domains under an explicit application policy when deterministic grouping is required.

Reading scans O(n); writing creates a new String proportional to the address length. No DNS/I/O occurs. The item is mutable, collection-owned and not thread-safe.

The source-reviewed example first checks a known simple raw address to avoid the multi-at replacement quirk. It was not used for delivery.

**External references**

- [Indy upstream: `IdEMailAddress.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - exact backward getter and first-at setter.
- [RFC 5322 section 3.4.1](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4.1) - domain grammar that this property does not validate.

<small>Created 2026-07-15</small>
