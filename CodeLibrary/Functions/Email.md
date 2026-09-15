---
title: "Email"
description: "Functions for validating email-like text and sending HTML messages through Velox's configured email service."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - email
  - recipients
  - attachments
---

The Email group contains one format check and three message-sending procedures. Use it when a mapping must make a preliminary decision about email-like text or deliberately deliver an HTML notification through the email service configured for the active Velox environment.

## Common tasks

- Use [`IsEmailValid`](Email/IsEmailValid.md) for the exact anchored regular-expression check implemented by Velox.
- Use [`SendEmailTo`](Email/SendEmailTo.md) when the configured default sender is appropriate.
- Use [`SendEmail`](Email/SendEmail.md) when the script must supply sender details, or [`SendEmailCC`](Email/SendEmailCC.md) when CC and BCC inputs are also required.

## Important behaviour

Validation and delivery are different operations. `IsEmailValid` recognises only the text shape encoded in Velox's current pattern. It does not prove that a domain exists, an address is owned, a mailbox accepts messages or a later delivery will succeed.

The sending entries construct an HTML message and cross an external-system boundary. Their behavior depends on Velox email configuration, network reachability, service credentials, sender policy, recipient acceptance and attachment-file access under the executing service identity. Read the selected entry for its exact sender defaults, recipient parsing, attachment rules and exception/result contract.

Function arguments are evaluated before the send procedure runs. Building an address or attachment path can therefore fail even when surrounding script logic later appears to make the value unnecessary.

## Safety and operational guidance

- Treat recipients, subject, body and attachment names as potentially sensitive output. Do not place credentials, tokens or unrestricted source data in a message.
- Validate business authorization separately from address syntax. A syntactically acceptable destination is not necessarily an approved recipient.
- Use only known attachment paths. A script-supplied path can disclose a file readable by the Velox service account.
- Email is not transactional with database or mapping work. A later map failure does not recall a message already accepted by the external service.
- Avoid retry designs that can send duplicates. Use flow identity or another idempotency mechanism appropriate to the integration.

The child pages are authoritative for exact side effects and error handling; do not infer equivalent overloads merely because all three procedure names begin with `SendEmail`.
