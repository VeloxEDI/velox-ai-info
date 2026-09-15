---
title: "Configure MSMQ output"
description: "Configure Microsoft Message Queuing output queue format, delivery, transaction and authentication settings."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [MSMQ output, Message Queuing, delivery type, transactional queue]
---

MSMQ output adds no published fields beyond the MSMQ base and shared Transport settings.

| Setting | Default | Required decision |
| --- | --- | --- |
| Visibility / queue name | Private / empty | Select and verify the exact destination queue. |
| Delivery type | Express | Choose the required MSMQ delivery mode and confirm persistence expectations. |
| Use transaction | Cleared | Must match queue type and the required atomicity boundary. |
| Direct format / type | Cleared / OS | Use only when the deployment requires direct format names. |
| Authenticate | Cleared | Requires compatible MSMQ/Windows security configuration. |

Test queue unavailable/full, permissions, transactional mismatch, duplicate send and consumer acknowledgement. Flow success registers outbound work; queue insertion and business consumption are later boundaries. An uncertain send result must be reconciled using message/business identifiers before retry.
