---
title: "Configure SMTP output"
description: "Configure SMTP recipients, subject, text/HTML body, attachments, read receipts, authentication and TLS."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [SMTP output, email recipients, HTML body, attachment, read receipt]
---

| Setting | Default | Effect |
| --- | --- | --- |
| Host / port / authentication | Base values | SMTP endpoint and identity. Configure the server's required port/TLS/auth path explicitly. |
| To / CC / BCC | Empty | Tag-processed recipients. Validate resolved addresses and prevent untrusted recipient injection. |
| Subject | Empty | Tag-processed subject. Keep secrets/business-sensitive data out of subject lines. |
| Text / HTML body | Empty | Message bodies. Escape/validate data inserted into HTML. |
| Load attachment into text body | Cleared | Uses attachment content as text body. Test encoding/size and data disclosure. |
| Load attachment into HTML body | Cleared | Uses attachment content as HTML body. Treat attachment content as untrusted. |
| Read receipt | Cleared | Requests a receipt; it is not proof that the recipient read or processed the business message. |

Test exact resolved recipients, empty/large/multiple/binary attachments, non-ASCII subject/body, SMTP acceptance/rejection, ambiguous timeout and duplicate sends. SMTP acceptance is not recipient inbox or business-processing confirmation. Before retrying, correlate Transport log, message identity and mail-system evidence. Protect trace logs because SMTP/auth/message content can be sensitive.
