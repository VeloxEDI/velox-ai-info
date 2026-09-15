---
title: "SendEmailCC"
description: "Builds and sends an HTML email through Velox's configured email service with To, CC, BCC, sender and optional attachment inputs."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - email
  - smtp
  - attachments
  - tls
---

```Delphi
function SendEmailCC(const aTo, aCC, aBCC, aFrom, aFromName, aSubject, aMessageHTML: string; const aAttachment: array of string): boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Attachments: array of string;
  Sent: Boolean;
begin
  SetLength(Attachments, 1);
  Attachments[0] := 'C:\VeloxExamples\sample.txt';

  Sent := SendEmailCC(
    'to@example.invalid',
    'copy@example.invalid',
    'audit@example.invalid',
    'sender@example.invalid',
    'Velox example',
    'Example message',
    '<p>This is fictional example content.</p>',
    Attachments);

  Value := Sent;
end;
```

### Usage

`SendEmailCC` builds and sends an HTML email through Velox's configured email service with To, CC, BCC, sender and optional attachment inputs.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aTo` | `string`, `const` | Recipient-list text passed to Velox's `TIdEMailAddressList.EmailAddresses` parser. If parsing produces no To recipient, `TvxEmail.Send` tries the General Setup administrator address. |
| `aCC` | `string`, `const` | Carbon-copy recipient-list text. An empty string skips assignment. A non-empty configured `OverrideEmail` later clears this list. |
| `aBCC` | `string`, `const` | Blind-carbon-copy recipient-list text. An empty string skips assignment. A non-empty configured `OverrideEmail` later clears this list. |
| `aFrom` | `string`, `const` | Sender address. An empty value preserves the General Setup sender address already loaded into the email object. |
| `aFromName` | `string`, `const` | Sender display/organisation name. An empty value independently preserves the configured display name. |
| `aSubject` | `string`, `const` | Message subject passed to the Velox message without additional validation by this function. |
| `aMessageHTML` | `string`, `const` | HTML body source. A non-empty value is used as supplied; it is not HTML-escaped or converted from plain text. An empty value allows the configured default body path to run during `Send`. |
| `aAttachment` | `array of string`, `const` | Zero or more Windows file paths. Empty elements are skipped. Missing or unreadable files can be silently omitted; see **Errors**. |

**Returns**

`True` when the selected Velox send call returns without the function detecting a send failure. This means the message was handed to the configured SMTP/direct-relay operation; it is not a delivery, mailbox or read confirmation.

`False` is returned when email sending is inactive, when non-relay mode has no SMTP host, or when the resulting sender address is empty. Other failures commonly raise instead of returning `False`.

### Additional Technical Info
`SendEmailCC` constructs one HTML email with explicit To, CC, BCC and sender inputs, optionally adds files, and sends it synchronously through the email path selected in Velox General Setup. It is the terminal scripting wrapper used by `SendEmail` and `SendEmailTo`.

The addresses and path in the example are fictional. Do not run the example until recipients, `OverrideEmail`, SMTP/relay settings and attachment paths have been reviewed in a controlled environment: a configured override can replace even a reserved example recipient with a real address. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The script registration binds this identifier to `TvxScripter.SendEmailCC`. The wrapper creates a new `TvxEmail` owned by the current scripter, then:

1. snapshots current General Setup email, authentication, certificate and routing settings under the setup lock;
2. applies `aFrom` and `aFromName` field-by-field, retaining a configured value for each blank argument;
3. passes To, CC and BCC list text to the message's Indy address-list objects;
4. assigns the subject and, when non-empty, creates an HTML MIME part from `aMessageHTML`;
5. loops over the attachment array and calls `TvxEmail.AttachFile` for every non-empty element;
6. calls `TvxEmail.Send`; and
7. frees the complete email/message/SMTP object graph in a `finally` block.

`TvxEmail.Send` first checks `SMTPActive`. If To is empty, it attempts to add `AdminEmail`. If `OverrideEmail` is non-empty, it clears To, CC and BCC and replaces them with the override list. It validates the non-relay host and sender, supplies the configured default body when no explicit body was set, and then either connects/sends/disconnects a `TIdSMTP` client or invokes `TIdSMTPRelay` for direct relay delivery.

**Behaviour**

- SMTP mode uses the configured host, port, authentication, SSL/TLS and optional OAuth provider. Direct-relay mode uses Velox's DNS server selection and the Indy relay component rather than the configured SMTP host.
- `aFrom` and `aFromName` fall back independently. You can override the address while retaining the configured display name, or the reverse.
- A non-empty `OverrideEmail` is an absolute recipient reroute for this path: it removes the supplied To, CC and BCC lists before sending.
- A non-empty explicit body becomes a multipart message containing an HTML part. The wrapper does not create a plain-text alternative when none already exists.
- Explicit HTML uses `text/HTML` and `7bit` transfer metadata without assigning a charset in this wrapper. Verify non-ASCII content with the actual receiving systems.
- If `aMessageHTML` is empty, the configured default body is used when available. That default-body path converts CRLF sequences to `<br>` before building the HTML part; the explicit body path does not.

**Edge cases and quirks**

- Recipient strings are not passed through `IsEmailValid`. Their accepted list syntax and any parse exception come from the shipped Indy address-list implementation.
- If both `aTo` and the configured `AdminEmail` are empty, the wrapper does not stop after the fallback attempt. The downstream send can raise because no usable recipient exists.
- `AttachFile` first checks `FileExists`, catches every attachment-construction exception and returns `nil`; `SendEmailCC` ignores that result. A missing, inaccessible, raced or otherwise rejected file can therefore be omitted while the overall function still returns `True`.
- A non-empty attachment can disappear or change between the initial existence check and MIME encoding. The helper does not provide a stable file snapshot or attachment manifest.
- An empty explicit HTML string does not mark the body as set. If the configured default body is also empty, the wrapper still proceeds with an empty/default Indy message body.
- The configured certificate-verification flags are copied into the SSL handler, but the current peer-verification callback returns `True` without consulting `AOk`, `AError`, `ADepth` or the certificate. A presented certificate cannot be rejected by that callback based on Indy's verification result. Do not describe this path as enforcing peer identity solely because the General Setup verification flags are selected.
- The SSL private-key password callback returns an empty string. A password-protected client key is not supplied its configured password by this path.
- In direct-relay mode, the `TLS` setter is a no-op; SSL handling and relay behaviour differ from the authenticated `TIdSMTP` path.
- Relay status handling stores whether the most recent callback action equals `dmWorkEndWithException`; it does not accumulate failures across every callback. Multi-recipient relay status therefore should not be treated as per-recipient delivery evidence.
- The inner `try/except` around `Send` only re-raises. It does not convert send exceptions to `False`.

**Side effects**

Reads General Setup, certificate/key files and nominated attachment files under the executing Windows identity. It can perform DNS resolution, OAuth/token work, TCP/SSL/TLS connections and external SMTP delivery. It writes configuration/failure messages to the Velox log on selected paths and holds message and protocol data in memory until the email object is freed.

**Errors**

- Inactive sending, missing non-relay SMTP host and empty sender are logged and return `False`.
- Attachment-file failures are swallowed and are not reflected in the Boolean result.
- Address parsing, setup/object construction, DNS, certificate/key loading, authentication, OAuth/SMTP, network, MIME encoding and allocation exceptions are not caught by the scripting wrapper and propagate to the script. The helper performs no retry.
- The OAuth token callback logs token acquisition failures and can leave authentication without a usable access token; a later connection/authentication failure can then propagate.
- Direct relay can raise a generated error when its retained failure flag is set after the send call.

**Performance and concurrency**

The call is synchronous and can block on file access, DNS, OAuth, connection, authentication and server response. It creates independent email, message and SMTP/relay objects for each invocation and snapshots setup values under a lock, so it does not share an Indy message object between calls.

All attachments and the encoded message contribute to memory and network cost. The attached connection intercept also assembles sent/received protocol text in memory for the lifetime of the object, which can duplicate large encoded message content. There is no size limit, timeout or retry policy exposed by this scripting declaration. Concurrent calls can independently send duplicate messages and can observe different setup snapshots or changing attachment files.

**Remarks**

- Treat the function as an externally visible operation. Make the Flow idempotent or record a business send key before retrying a failed execution; a raised exception does not prove that the remote server accepted nothing.
- Review `SMTPActive`, relay/host/authentication, `AdminEmail`, `OverrideEmail`, sender and certificate settings before enabling a script. The current wrapper supplies no dry-run mode.
- HTML-encode untrusted values before inserting them into `aMessageHTML`. The helper deliberately sends the supplied markup rather than sanitising it.
- Use only allow-listed attachment paths available to the Velox process identity, and validate expected files before calling when omission is unacceptable.

**Related entries**

- [`SendEmail`](SendEmail.md) calls this function with blank CC and BCC values while accepting explicit sender details.
- [`SendEmailTo`](SendEmailTo.md) calls this function with blank CC, BCC and sender values so General Setup supplies the sender.
- [`IsEmailValid`](IsEmailValid.md) applies a narrow syntax pattern; this function does not call it automatically.

<small>Created 2026-07-15</small>
