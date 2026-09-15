---
title: EMailAddresses
description: Serializes formatted items with comma-space or destructively clears and permissively parses an address-list string with comments and groups.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, address-list, parser, groups]
---

```Delphi
property EMailAddresses: string read write;
```

### Example

```Delphi
procedure ReplaceRecipients(const Recipients: TIdEMailAddressList);
begin
  Recipients.EMailAddresses :=
    'North <north@example.invalid>, South <south@example.invalid>';
end;
```

### Usage

`EMailAddresses` serializes formatted items with comma-space or destructively clears and permissively parses an address-list string with comments and groups.

### Additional Technical Info
`EMailAddresses` is the combined textual view of a [`TIdEMailAddressList`](../../TIdEMailAddressList.md). Reading formats; writing replaces the collection through a permissive parser.

#### Reading

The getter traverses current order, obtains each item's [`Text`](../../TIdEMailAddressItem/Properties/Text.md), and joins values with the exact delimiter `, ` (comma plus space). An empty list returns empty String.

The result is canonicalized formatter output, not original header bytes. Comments, source spacing and quote choices are not preserved, and item formatter quirks remain visible. Repeated String concatenation can copy a growing result and consume more than linear allocation for large lists.

#### Writing and destructive replacement

The setter calls `Clear` **before** inspecting or parsing the value. Empty/whitespace input therefore empties the list and returns. Existing item references become invalid immediately.

For non-empty input, a state machine splits comma-separated mailboxes while tracking quoted strings, backslash escapes and nested comments. It recognizes group labels introduced by colon and terminated by semicolon; the group name itself is discarded, and members become ordinary flat list entries. Blank items and parsed `<>` entries are disposed.

Every candidate is delegated to the individual permissive `Text` parser. The operation does not prove RFC validity, deliverability, DNS or SMTPUTF8 compatibility. It has no success result and can silently normalize or reshape malformed content.

Colon handling is syntactic rather than semantic: an unquoted colon outside a comment starts a group and discards accumulated prefix text. Ambiguous or malformed values can therefore lose content. Unbalanced comments/quotes/groups are not reported through a strict parse error contract.

#### Failure and round-trip limits

Replacement is non-transactional. Allocation, item parsing, collection notification or malformed-edge failures propagate after the old collection has been destroyed and after zero or more new entries were added. Parse into a separately owned/staged representation before mutating a production message when all-or-nothing behavior is required.

Reading then writing may change raw fields because each item is formatted and reparsed. Writing then reading normally normalizes whitespace, removes comments/group labels and applies Indy's quoting decisions. Do not use this property when exact header preservation is required.

Parsing/formatting is at least O(n) in input length, with repeated managed-string operations and per-item allocations. Limit external header length and recipient count. The list is mutable and not thread-safe.

The source-reviewed example uses reserved `.invalid` domains and replaces the list deliberately. It was not sent or runtime-tested.

**External references**

- [Indy upstream: `TIdEMailAddressList.SetEMailAddresses`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - complete clear-first list parser and getter.
- [RFC 5322 section 3.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4) - normative address-list and group syntax.
- [RFC 5322 section 3.2.2](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.2.2) - comments and quoted-pair context.

<small>Created 2026-07-15</small>
