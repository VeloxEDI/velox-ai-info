---
title: Text
description: Parses combined mailbox text destructively or formats the current name and address through Indy's permissive quoting rules.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, email-address, parser, formatter, quoting]
---

```Delphi
property Text: string read write;
```

### Example

```Delphi
procedure ParseRecipient(const Item: TIdEMailAddressItem);
begin
  Item.Text := '"Operations, North" <ops@example.invalid>';
  // Inspect Item.Address and Item.Name; do not treat parsing as validation.
end;
```

### Usage

Parses combined mailbox text destructively or formats the current name and address through Velox's permissive quoting rules.

### Additional Technical Info
`Text` combines or splits the raw [`Name`](Name.md) and [`Address`](Address.md) fields. Its getter is a formatter; its setter is a hand-written permissive parser. The property has no Boolean success result and is not a strict RFC validator.

#### Reading: formatting current fields

With a non-empty name that differs from the address under case-insensitive locale-aware comparison, the getter emits `name formatted-address`. It double-quotes names containing characters outside Indy's ASCII atom-plus-space set and escapes embedded backslashes or double quotes.

The address formatter splits at the last `@`. It normally emits the raw local part and domain, adding angle brackets when a display name exists. If it finds an unsupported local-part character, it quotes the local part and escapes backslashes/double quotes.

There is an important implementation shortcut: a period is treated as acceptable immediately when it is the **first** character outside the atom set. The formatter then stops checking the remainder. A local part containing a period before a later space or other invalid character can therefore be emitted unquoted. Formatted `Text` is not evidence of validity.

Special empty behavior is also observable: empty address plus non-empty name formats with `<>`; both empty format as empty. If name and address compare equal case-insensitively, the name is suppressed.

#### Writing: destructive permissive parsing

The setter clears both fields **before** parsing. It trims outer whitespace, then scans comments, nested parentheses, display-name quotes, angle brackets, at-signs, dots and backslash escapes. Common forms such as `name <local@domain>`, quoted names, comments and an unadorned address are accepted.

The parser is intentionally tolerant and does not confirm balanced quotes/comments/brackets, exactly one at-sign, legal dot placement, valid domain labels or complete consumption under a strict grammar. Its quoted-state search can use the last quote/backslash delimiter in the remaining text; ambiguous embedded quotes can be normalized in surprising ways. Some malformed angle-bracket input can lose trailing content. No rollback restores previous fields.

Do not use `Item.Text := ExternalValue` as an email-validation test. After assignment, separately validate the resulting raw address under the application's delivery policy, and reject unexpected residual semantics such as empty components or multiple at-signs.

#### Round-trip and operational behavior

Parse then format is a canonicalizing operation, not byte preservation. Comments may disappear, spacing and quoting can change, escapes are interpreted, and invalid content can be silently reshaped. [`EMailAddresses`](../../TIdEMailAddressList/Properties/EMailAddresses.md), filtering and sorting use this behavior for list-level operations.

Time is typically O(n), but repeated String concatenation can increase allocation/copy cost. Impose header length limits. The item is mutable and not thread-safe.

The source-reviewed example uses a fictional `.invalid` address and explicitly separates parsing from validation. It was not executed by the documentation workflow.

**External references**

- [Indy upstream: `IdEMailAddress.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdEMailAddress.pas) - complete `SetText`, `GetText` and `ConvertAddress` implementation.
- [RFC 5322 section 3.4](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.4) - normative address and address-list syntax.
- [RFC 5322 section 3.2.2](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.2.2) - quoted-pair and comment syntax handled permissively by Indy.

<small>Created 2026-07-15</small>
