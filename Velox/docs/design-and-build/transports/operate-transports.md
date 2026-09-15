---
title: "Test and operate Transports"
description: "Test connections, send queued output and monitor Transport results"
sidebar_position: 60
slug: /transports/operate-transports
classification: public
status: approved
owner: Cam Hart
keywords: ["transport-test", "queue", "transport-log"]
---

Test a Transport with sanitised content, then verify Flow queue creation and VeloxService delivery as separate outcomes.

## Before you begin

- **Audience:** Implementers and authorised operators.
- **Prerequisites:** An inactive Transport configured for a non-production endpoint and a tested local File Connection where applicable.
- **Permissions:** Endpoint, mailbox, queue and folder access for both the interactive user and VeloxService account.
- **Starting state:** Use a unique test correlation value and ensure no earlier queued item can be confused with this test.

:::warning Do not retry an uncertain delivery blindly
A Flow can finish after creating an outbound queue item, before the external system completes delivery. Check the Transport Log and receiver before rerunning the Flow or resending an item.
:::

## Steps

1. Open the inactive Transport and review endpoint, direction, authentication, file lifecycle, timeout and security settings.
2. Select **Test with...** and choose or enter the smallest sanitised test input supported by the Transport.
3. Inspect the test log, then verify the remote endpoint and local file/mail/queue state independently.
4. Save the Transport. For inbound processing, link it under the monitored Flow's **Transports to Monitor**. For outbound processing, add it as a Flow Transport step.
5. Run the Flow once with a unique test value.
6. Confirm the Flow execution created the intended outbound Transport item or collected the intended inbound item.
7. In Transport Logs, follow the matching item through attempts and final state. Verify delivery/receipt in the external system.
8. Activate automated processing only after the runtime identity and complete lifecycle pass.

## Verify the result

- The test and service run use the intended Transport, endpoint and direction.
- One input creates one intended queue/delivery outcome.
- Attempt count and final Transport status match receiver evidence.
- Local completed/error files and remote post-receipt state follow configuration.
- No secrets or unnecessary payloads remain in diagnostic logs.

## Recover or roll back

Disable the owning Flow/Transport path before manipulating files or queue items. Preserve logs and the original input. Determine whether the receiver processed the item before resending. Use receiver-specific reversal or compensating procedures; changing a Transport Log does not reverse an external effect.

## Troubleshoot

- **Designer test passes but service delivery fails:** compare runtime account permissions, certificate/key access, proxy/network route and local paths.
- **The Flow succeeds but nothing arrives:** locate the outbound Transport Log and inspect attempts; Flow completion is not delivery confirmation.
- **An inbound item repeats:** inspect **After Receiving**, remote move/delete, local completed/error moves and competing monitors.
- **Status is uncertain after timeout:** verify the external system using the unique correlation value before retrying.

## Next steps

See [Review Transport Logs](../../operate-and-troubleshoot/transport-logs.md) and [file and Transport troubleshooting](../../operate-and-troubleshoot/file-and-transport-troubleshooting.md).
