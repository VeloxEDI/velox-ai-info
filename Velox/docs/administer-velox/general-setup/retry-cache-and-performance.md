---
title: "Retry, cache and performance settings"
description: "Configure shared Transport retry, Flow cache and shutdown-wait behaviour without confusing separate retry mechanisms."
sidebar_position: 70
classification: public
status: approved
owner: Cam Hart
keywords: [retry settings, cache, performance, Transport attempts]
---

General Setup supplies defaults/flags used by runtime managers. Flow re-run/retry and outbound Transport delivery retry are separate state machines; configure and monitor them separately.

| Property | Type/default | Runtime effect |
| --- | --- | --- |
| `TransportAttemptInterval` | integer seconds / `20` | Outbound manager multiplies by 1,000 for its millisecond timer interval |
| `TransportMaxAttempts` | integer / `7` | Maximum outbound send attempts before failure |
| `CacheManualActions` | Boolean / `false` | Controls manual Flow caching behaviour |
| `ReloadModuleOnError` | Boolean / `true` | Runtime reload flag; exact points vary and must be tested for the affected module |
| `MaxWaitBeforeTermination` | seconds / `3600` | Maximum wait in termination-related behaviour; avoid forced stop during long work |
| `SafeReportProcessing` | Boolean / `false` | Copied into Report runtime processing state |

## Change safely

1. Establish current queue depth, attempt counts, Flow duration and service state.
2. Change one value in test and create a controlled success and failure.
3. Inspect Flow Logs and Transport Logs separately, including attempts and next-attempt time.
4. Restart/reload the relevant service and confirm the stored value is active.
5. Watch for duplicate deliveries, queue growth, resource pressure and unexpectedly terminated work.

Do not reduce retry intervals to mask an endpoint outage. Fix the dependency and choose a retry profile that the endpoint and business process can tolerate.
