---
title: "IsEmailValid"
description: "Checks whether a string matches Velox's anchored email-like regular-expression pattern."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - email
  - validation
  - regular-expression
---

```Delphi
Function IsEmailValid( const aValue : string) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsEmailValid('integration@example.invalid');  // True
end;
```

### Usage

`IsEmailValid` checks whether a string matches Velox's anchored email-like regular-expression pattern.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `string`, `const` | Complete text to test. Velox does not trim or otherwise normalise it before matching. |

**Returns**

`True` when `aValue` matches the fixed pattern; otherwise `False`. A true result says nothing about deliverability.

**Behaviour**

- Both sides of `@` must start with one or more regex word characters.
- After that initial run, a dot, hyphen or underscore is accepted only when followed by another non-empty run of word characters.
- The domain does not have to contain a dot or a conventional top-level domain. For example, `user@host` matches.
- The same punctuation rules are applied to the local and domain portions. This means an underscore in a domain label can match even though it is not a conventional DNS host-name character.
- The helper performs no case conversion, DNS lookup, mailbox verification or SMTP interaction.

**Errors**

The pattern is a fixed, valid product constant, so ordinary non-matching input returns `False`. Exceptions from allocation or the installed regular-expression engine are not caught by the Velox function and would propagate to the script.

**Usage notes**

Use this helper only for the deliberately narrow syntax policy described above. If a Flow requires an organisation-specific address policy, enforce that policy explicitly and treat actual delivery success as a separate SMTP outcome.

### Additional Technical Info
`IsEmailValid` applies Velox's fixed email-like regular expression to the supplied string. It is a syntactic screening helper, not proof that the address, domain or mailbox exists and not a complete implementation of the Internet email-address standards.

The example uses the reserved `.invalid` top-level domain. It demonstrates pattern matching only and does not contact DNS, SMTP or any other service. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The scripting import registers the Velox-owned `IsEmailValid` function. It passes this fixed pattern and `aValue` to the shared `RegExMatch` helper:

```text
^(\w+([\-\_\.]\w+)*)@(\w+([\.\-\_]\w+)*)$
```

`RegExMatch` calls the two-string class overload of Delphi `System.RegularExpressions.TRegEx.IsMatch`, with the email text as `Input` and the fixed expression as `Pattern`. The installed Delphi routine creates a regular-expression record with its default options, performs one match and returns `TMatch.Success`.

**Edge cases and quirks**

- Ordinary leading or trailing spaces and tabs fail because Velox does not trim `aValue`. Do not treat the final `$` as a strict end-of-buffer assertion, however: under the installed PCRE-compatible anchor rules it can match before a permitted final newline.
- Empty components, leading/trailing separators and consecutive dots or hyphens fail under the grouped pattern.
- Common valid email forms that use a plus tag, quoted local part, address literal, comment or display name fail. For example, `user+tag@example.invalid` does not match.
- The meaning of `\w`, anchors and other regex constructs is the installed Delphi PCRE wrapper's meaning. Velox supplies no regex options of its own and does not claim RFC mailbox equivalence.
- A matching `.invalid` address remains deliberately undeliverable. Conversely, a matching real-looking address may not exist.
- The three `SendEmail*` helpers do not call `IsEmailValid`; scripts must decide separately whether and how to validate recipient inputs.

**Side effects**

None. The function does not mutate its input or perform external I/O.

**Performance and concurrency**

Each call creates and evaluates a new Delphi regular-expression instance; Velox does not cache a compiled pattern. Work and temporary allocation grow with the input length. The call has no Velox shared mutable state and is re-entrant for independent inputs.

**Related entries**

- [`SendEmailCC`](SendEmailCC.md) accepts recipient strings but does not invoke this validation helper.
- [`SendEmailTo`](SendEmailTo.md) sends through the configured default sender and likewise performs no `IsEmailValid` pre-check.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.IsMatch`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.RegularExpressions.TRegEx.IsMatch) - the exact Delphi core helper and overload family beneath Velox's fixed pattern.
- [Free Pascal: `TRegExpr.Exec`](https://www.freepascal.org/daily/packages/regexpr/regexpr/tregexpr.exec.html) - compatibility context for Boolean regular-expression matching; it is not the terminal used by Velox and may differ in regex dialect and options.

<small>Created 2026-07-15</small>
