---
title: "SendEmail"
description: "Builds and sends an HTML email through Velox's configured email service with explicit sender details and optional file attachments."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - email
  - smtp
  - attachments
---

```Delphi
function SendEmail(const aTo, aFrom, aFromName, aSubject, aMessageHTML: string; const aAttachment: array of string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Attachments: array of string;
  Sent: Boolean;
begin
  SetLength(Attachments, 0);

  Sent := SendEmail(
    'to@example.invalid',
    'sender@example.invalid',
    'Velox example',
    'Example message',
    '<p>This is fictional example content.</p>',
    Attachments);

  Value := Sent;
end;
```

### Usage

`SendEmail` builds and sends an HTML email through Velox's configured email service with explicit sender details and optional file attachments.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aTo` | `string`, `const` | Recipient-list text passed to Velox's address-list parser. If no To recipient results, the send tries the General Setup administrator address. |
| `aFrom` | `string`, `const` | Sender address. A blank value preserves the configured sender address already loaded into the email object. |
| `aFromName` | `string`, `const` | Sender display/organisation name. A blank value independently preserves the configured display name. |
| `aSubject` | `string`, `const` | Message subject. The function performs no subject validation or templating. |
| `aMessageHTML` | `string`, `const` | HTML markup to send. A non-empty value is used without HTML escaping; an empty value lets the configured default-body path run. |
| `aAttachment` | `array of string`, `const` | Zero or more Windows file paths. Empty elements are skipped, and attachment failures can be silently ignored. |

**Returns**

`True` when the configured Velox send call returns without a retained relay failure. It does not mean the destination mailbox accepted or displayed the message.

`False` is returned for inactive email sending, a missing SMTP host in non-relay mode, or an empty resulting sender. Attachment problems do not make the result false. Many connection, authentication and send failures raise instead.

**Errors**

- Inactive sending, missing non-relay host and missing sender are logged and return `False`.
- Missing or unreadable attachments can be silently omitted.
- Address parsing, setup/object creation, DNS, file races, certificate/key loading, OAuth, authentication, MIME, network and SMTP/relay exceptions propagate to the script. There is no retry.

### Additional Technical Info
`SendEmail` sends an HTML email to a To list using explicit sender inputs and an optional array of file attachments. It is a convenience wrapper over `SendEmailCC`; it supplies empty CC and BCC values, then uses exactly the same General Setup, message construction and SMTP/direct-relay path.

The addresses in the example use the reserved `.invalid` domain and the attachment array is empty. Do not run it until `OverrideEmail` and all email settings have been reviewed: a configured override can reroute the message to a real address. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The scripter registers `TvxScripter.SendEmail` directly. Its complete body calls:

```text
SendEmailCC(aTo, '', '', aFrom, aFromName, aSubject, aMessageHTML, aAttachment)
```

`SendEmailCC` then creates a `TvxEmail`, snapshots General Setup under its lock, constructs the Indy message, adds each non-empty attachment and calls `TvxEmail.Send`. The terminal selects configured `TIdSMTP` connect/send/disconnect behaviour or `TIdSMTPRelay` direct-relay behaviour and frees all per-call objects in a `finally` block.

**Behaviour**

- No CC or BCC list is created by this wrapper.
- Blank `aFrom` and `aFromName` values fall back independently to their configured General Setup values.
- If the parsed To list is empty, `AdminEmail` is attempted. A non-empty `OverrideEmail` then clears the To list and replaces it; the override therefore wins over `aTo` and the administrator fallback.
- A non-empty body is created as an HTML MIME part with `7bit` transfer metadata and no charset assigned by the Velox wrapper. The HTML is neither escaped nor converted from plain text.
- An empty body uses configured default-body processing when that text is available; its CRLF sequences are changed to `<br>`.

**Edge cases and quirks**

- `SendEmail` does not call `IsEmailValid`. Recipient and sender strings reach Indy/configuration checks without the Code Library validation pattern.
- An empty `aTo` with an empty `AdminEmail` is not rejected immediately. The downstream SMTP/relay operation can raise for the missing recipient.
- Each attachment is included only if `FileExists` succeeds and Indy attachment construction does not raise. The attachment helper swallows its own exceptions, and this wrapper ignores its result, so the message can be sent successfully without an expected file.
- The current SSL peer-verification callback returns `True` regardless of Indy's `AOk`, error, depth or certificate values. A presented certificate is not rejected by this callback based on the reported verification outcome.
- The SSL client-key password callback returns an empty string, and direct-relay TLS configuration is not the same as the normal authenticated SMTP path.
- Relay status keeps only whether the latest callback action reports an exception, rather than a per-recipient result history.
- The underlying `try/except` re-raises send exceptions; it does not turn them into `False`.

**Side effects**

Reads General Setup and any nominated attachment files. Depending on configuration, it can resolve DNS, obtain an OAuth token, open SMTP/SSL/TLS connections, send an external message and write selected configuration/authentication failures to the Velox log.

**Performance and concurrency**

The call is synchronous and may block on file, DNS, OAuth and network work. It creates independent message and SMTP/relay objects for each call, but concurrent executions can still send duplicate messages or read different setup/file snapshots. Attachment and encoded-message size governs memory and network use; the connection intercept also retains protocol text in memory for the per-call object's lifetime. No size, timeout or retry argument is exposed.

**Remarks**

- Review `SMTPActive`, routing mode, `AdminEmail`, `OverrideEmail`, sender, authentication and certificate settings before enabling the script. There is no dry-run parameter.
- HTML-encode untrusted values and allow-list attachment paths. Check required files explicitly before calling when a missing attachment must fail the Flow.
- Design retry handling around an idempotency/business-send record. A raised exception is not reliable proof that the remote SMTP server accepted no message.

**Related entries**

- [`SendEmailCC`](SendEmailCC.md) is the full terminal wrapper and exposes CC and BCC inputs.
- [`SendEmailTo`](SendEmailTo.md) also omits CC/BCC and uses configured sender details rather than explicit sender arguments.
- [`IsEmailValid`](IsEmailValid.md) performs a narrow syntax screen but is not called by this function.

<small>Created 2026-07-15</small>
