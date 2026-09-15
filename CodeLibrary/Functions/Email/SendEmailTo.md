---
title: "SendEmailTo"
description: "Builds and sends an HTML email through Velox's configured email service using the default sender and optional file attachments."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - email
  - smtp
  - default-sender
---

```Delphi
function SendEmailTo(const aTo, aSubject, aMessageHTML: string; const aAttachment: array of string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Attachments: array of string;
  Sent: Boolean;
begin
  SetLength(Attachments, 0);

  Sent := SendEmailTo(
    'to@example.invalid',
    'Example message',
    '<p>This is fictional example content.</p>',
    Attachments);

  Value := Sent;
end;
```

### Usage

`SendEmailTo` builds and sends an HTML email through Velox's configured email service using the default sender and optional file attachments.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aTo` | `string`, `const` | Recipient-list text passed to Velox's address-list parser. If it produces no To recipient, Velox tries the General Setup administrator address. |
| `aSubject` | `string`, `const` | Message subject passed through without function-level validation or templating. |
| `aMessageHTML` | `string`, `const` | HTML markup to send. A non-empty value is not escaped; an empty value allows the configured default body to be used. |
| `aAttachment` | `array of string`, `const` | Zero or more Windows file paths. Empty elements are skipped; missing or unreadable attachments can be silently omitted. |

**Returns**

`True` when the configured Velox SMTP/direct-relay send call returns without the function retaining a relay failure. It is not a final-delivery or read receipt.

`False` is returned when sending is inactive, the normal SMTP path has no host, or the configured sender address is empty. Other failures commonly propagate as exceptions, while attachment failures can be ignored.

**Usage notes**

- Use this entry only when General Setup is the intended sender authority. Review `AdminEmail`, `OverrideEmail`, routing, authentication and certificate settings before enabling it.
- HTML-encode untrusted values and explicitly verify required attachment paths before calling.
- If a failed Flow can retry, use a business idempotency/send record. A transport exception can occur after some remote work has already happened.

### Additional Technical Info
`SendEmailTo` sends an HTML email to a To list using the sender address and display name from Velox General Setup. It is a convenience wrapper over `SendEmailCC`; it supplies blank CC, BCC, sender-address and sender-name arguments so the configured sender values remain in the per-call email object.

The example uses the reserved `.invalid` domain and no attachments. It still must not be run until `OverrideEmail` and the shared email configuration have been reviewed, because an override can reroute the message to a real address. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The scripter binds `SendEmailTo` to `TvxScripter.SendEmailTo`. The wrapper calls:

```text
SendEmailCC(aTo, '', '', '', '', aSubject, aMessageHTML, aAttachment)
```

`TvxEmail.Create` has already copied the current configured sender address and display name under the General Setup lock. `SendEmailCC` calls `SetFrom` with two empty arguments; the Velox `CoalesceString` logic retains each copied value. The rest of the path constructs the message and delegates to the same `TvxEmail.Send`/Indy terminal used by the other email helpers.

**Behaviour**

- Sender address, display name/organisation and selected SMTP/relay/authentication/TLS settings come from the General Setup snapshot taken at call creation.
- No CC or BCC list is supplied.
- If To is empty, the terminal attempts `AdminEmail`. If `OverrideEmail` is non-empty, it subsequently clears the supplied/default recipient lists and sends only to the override list.
- A non-empty body is treated as HTML and is not sanitised. The wrapper creates an HTML MIME part with `7bit` transfer metadata but does not assign a charset.
- An empty body uses configured default-body processing when available; that path changes CRLF sequences to `<br>`.

**Edge cases and quirks**

- The function does not call `IsEmailValid`. A syntactically unexpected address reaches the shipped Indy parser or downstream SMTP operation.
- An empty `aTo` and empty `AdminEmail` can reach the transport rather than returning a dedicated missing-recipient result.
- There is no way to override only one sender field through this declaration: both are deliberately omitted and both use configuration. Use `SendEmail` or `SendEmailCC` when explicit sender values are required.
- Attachment existence/construction failures are caught by `TvxEmail.AttachFile`, and its `nil` result is ignored. A true function result can therefore accompany a message that omitted an expected attachment.
- The current SSL peer callback returns `True` without using Indy's reported verification result, error, depth or certificate. The client-key password callback supplies an empty string. Direct-relay TLS behaviour also differs from the normal SMTP path.
- Relay status retains only the most recent callback's exception state; it is not a per-recipient delivery ledger.
- The send wrapper re-raises exceptions rather than converting them into `False`.

**Side effects**

Reads General Setup and attachment files and can perform DNS, OAuth, TCP, SSL/TLS and external SMTP work. Selected inactive/configuration/authentication failures are written to the Velox log. Message and protocol content remain in the per-call objects until cleanup.

**Errors**

- Inactive sending, missing normal SMTP host and missing configured sender are logged and return `False`.
- Missing/unreadable attachments can be silently skipped.
- Address parsing, setup/object creation, DNS, certificate/key, OAuth, authentication, MIME, network and SMTP/relay exceptions propagate. The helper performs no retry.

**Performance and concurrency**

The call is synchronous. File, DNS, OAuth and SMTP work can block the executing Flow. Each invocation owns its message and transport objects and snapshots setup under a lock, but simultaneous calls can still send duplicates or observe different configuration/attachment states. Large attachments increase disk, memory and network cost; the per-call connection intercept also retains protocol text in memory. No size, timeout or retry control appears in this declaration.

**Related entries**

- [`SendEmailCC`](SendEmailCC.md) is the full terminal wrapper and accepts explicit sender, CC and BCC values.
- [`SendEmail`](SendEmail.md) accepts explicit sender values while leaving CC and BCC empty.
- [`IsEmailValid`](IsEmailValid.md) provides a narrow syntax check that this function does not run automatically.

<small>Created 2026-07-15</small>
