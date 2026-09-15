---
title: "Configure an Outbound Transport step"
description: "Register file-backed outbound work from a Flow and distinguish Flow completion from Transport delivery."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [Outbound Transport step, Transport queue, file event, delivery]
---

An Outbound Transport step links a configured outbound Transport to File Definition source data. During Flow execution it loads the Transport, copies applicable Flow logging/email settings and creates Transport/file log events for later processing. It does not perform the final protocol send inside the action-step call.

| Field | Required | Effect |
| --- | --- | --- |
| **Outbound Transport** / `ActionFIDS` | Yes | Reference to the configured Transport module. |
| **Source Data** | Yes | File Definition item containing the file(s) to register. Database-only data is not a direct outbound-file source. |
| **Transport class** | Derived/registered class | Identifies the outbound implementation. This is normally established by the selected Transport rather than typed as an arbitrary class name. |
| **Active** | Yes | Controls whether outbound work is registered. |

## Verification boundary

1. Test the [Transport](../../transports/operate-transports.md) separately against a controlled endpoint.
2. Select the intended file data item and Transport.
3. Run with a uniquely identifiable test file.
4. Confirm the Flow log creates the expected file/Transport event.
5. Confirm the Transport worker attempts the send and inspect its result.
6. Obtain receiver acknowledgement/business reconciliation where required.

An `OK` Flow means the registration step did not fail; it is not proof of delivery. Test mode suppresses normal outbound sending in the core completion path, but other Flow effects remain possible. Automatic Flow retry and Transport retry are separate mechanisms and can duplicate registration/delivery unless the interface has correlation/idempotency controls. See [files, records and messages](../data/files-records-and-messages.md) and [retry semantics](../runtime/retry-failure-and-cancellation.md).
