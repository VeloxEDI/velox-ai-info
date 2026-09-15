---
title: "Validate a Velox environment"
description: "Confirm the selected Velox context, dependencies, services and outputs before enabling processing."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [environment validation, production, test, Velox]
---

Validate an environment whenever it is installed, restored, promoted, upgraded or materially reconfigured.

1. In Designer, confirm the selected system-connection key and visible production/test label.
2. Cross-check the resolved Config, Log and Data hosts/databases against the approved environment record.
3. Open General Setup and verify the environment-specific paths, API/web values, email/proxy settings and service state without exposing secrets.
4. Test representative DB and File Connections under the required identities.
5. Confirm Velox Service and API Service parameters select the same intended key/context.
6. Run a controlled Flow whose inputs and side effects are safe in this environment.
7. Inspect the Flow Log and actual database/file/report output. If it queues outbound work, also inspect the Transport Log to final delivery/failure.
8. Validate schedule, monitor or REST invocation only when that trigger is within scope.

:::warning Labels are not isolation controls
A label that says “Test” does not prove that every mapped database, folder, endpoint or credential is non-production. Validate the resolved dependency values.
:::

Record the connection key, context, service names, module/test identifiers, expected and actual outputs, log status and approver/owner required by your organisation. Do not include secrets or customer payloads.
