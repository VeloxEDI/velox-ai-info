---
title: "Email and SMTP settings"
description: "Configure Velox notification sender, recipients, SMTP authentication and TLS defaults."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [SMTP, email notifications, OAuth, TLS, General Setup]
---

Email settings provide shared notification and SMTP behaviour. Transport-specific recipients/body fields are configured on an SMTP outbound Transport; the connection and security context comes from this shared setup.

## Message and connection fields

| UI purpose / property | Type/default | Effect |
| --- | --- | --- |
| From address / `FromEmail` | string / empty | Default sender; format is not validated in `TvxSetup` itself |
| Display name / `FromDisplayName` | string / empty | Friendly sender name |
| Administrator email / `AdminEmail` | address/list string / empty | Administrator notification target |
| Notification email / `NotifyEmail` | address/list string / empty | General notification target |
| Override email / `OverrideEmail` | address/list string / empty | Overrides normal routing when the email runtime uses it; verify before production use |
| Default body / `EmailBody` | text list / empty | Shared default body text |
| SMTP active / `SMTPActive` | Boolean / `true` | Enables shared SMTP behaviour where consumed |
| SMTP relay / `SMTPRelay` | Boolean / `true` | Relay-style flag; downstream impact varies by email path |
| SMTP server / `SMTPServer` | host / empty | Server address |
| SMTP port / `SMTPPort` | integer / `587` | Connection port; use the endpoint-approved value |
| Authentication / `SMTPAuthType` | authentication enum / none | Selects no/basic/Windows/OAuth-capable path as offered by the reviewed UI/version |
| OAuth client / tenant | string / empty | `SMTPOAuthClientId`, `SMTPOAuthTenant` |
| User/password | string / empty | `SMTPUserID`; password is encrypted on persistence and decrypted for runtime use |

## Shared TLS fields

| Property | Default | Effect |
| --- | --- | --- |
| Root/client certificate and key files | empty | Certificate paths used by SSL configuration; service account needs file access |
| Client key password | empty/encrypted | Secret for the client key |
| SSL client type | Auto | Protocol-version selection |
| TLS type | Implicit TLS | Negotiation mode; match the server's actual expectation |
| Certificate depth | `2` | Chain depth |
| Verify peer / fail without peer / verify once | `true` / `true` / `true` | Certificate verification behaviour; weakening it requires an approved security decision |

## Test and recovery

Use a sanitised test recipient, verify sender/recipient/body and inspect the exact SMTP/TLS error. Never publish the password, OAuth secret or private-key password. If a change fails, restore the previous values, restart/reload the consuming service and repeat the controlled notification test.
