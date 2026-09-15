---
title: "Configure email Transports"
description: "Configure IMAP, POP3 and SMTP/email exchange"
sidebar_position: 10
slug: /transports/email-transports
classification: public
status: approved
owner: Cam Hart
keywords: ["imap", "pop3", "smtp", "email"]
---

Use IMAP or POP3 to receive mail content and SMTP/email to send Flow output. Test with a dedicated non-production mailbox and approved recipients.

## Scope

| Transport | Main controls |
| --- | --- |
| IMAP inbound | **Host**, **Port**, **User Name**, **Password**, **SSL Settings**, **Mailbox**, authentication/OAuth values, optional address filters, **After Receiving**, move folder and optional custom processing script |
| POP3 inbound | **POP Host**, **POP Port**, username/password, SSL, authentication/OAuth values and SASL choice |
| SMTP outbound | **To Email**, **CC**, **BCC**, **Subject**, plain/HTML body, attachment-as-body choices and read-receipt request |

SMTP delivery uses the configured Velox email infrastructure as well as the Transport message fields. Confirm sender, relay, TLS/authentication and recipient policy in the target environment.

## Controlled setup

1. Create the email Transport and leave **Active** clear.
2. Configure a dedicated test mailbox or approved test recipients. Store credentials and OAuth client material through approved controls.
3. For inbound mail, set mailbox/address filters and **After Receiving** so a message is not repeatedly collected. Test custom processing scripts separately.
4. For outbound mail, use an unambiguous subject, safe body and sanitised attachment. Do not send customer or production data during initial testing.
5. Select **Test with...**. Confirm receipt/collection, attachment content and the post-receipt mailbox state.
6. Save and link the Transport to a controlled Flow only after independently verifying delivery and duplicate behaviour.

## Constraints and failure behaviour

- IMAP, POP3 and SMTP server/authentication combinations require deployment-specific compatibility testing.
- A read receipt is a request, not proof of delivery or reading.
- A successful SMTP hand-off does not prove final recipient delivery.
- **Clear Mail** is destructive; use it only on an approved test mailbox after preserving required evidence.
- Moving/deleting inbound messages before downstream processing is recoverable can cause data loss.
- Email addresses, subjects, bodies, attachments and traces may contain sensitive data.

## Related references

- [Configure IMAP input](imap-input.md)
- [Configure POP3 input](pop3-input.md)
- [Configure SMTP output](smtp-output.md)
- [Test and operate Transports](../operate-transports.md)
- [Review Transport Logs](../../../operate-and-troubleshoot/transport-logs.md)
- [File and Transport troubleshooting](../../../operate-and-troubleshoot/file-and-transport-troubleshooting.md)
