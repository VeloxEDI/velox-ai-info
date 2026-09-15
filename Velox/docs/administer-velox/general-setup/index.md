---
title: "Configure General Setup"
description: "Configure verified global Velox settings safely"
sidebar_position: 10
slug: /administration/general-setup
classification: public
status: approved
owner: Cam Hart
keywords: [general-setup, configuration, administrator]
---

General Setup contains configuration shared by the selected Velox context. A change can affect Designer, Velox Service, API Service and multiple integrations.

## Safe workflow

1. Confirm the system connection and test/production context.
2. Record or export the current settings and identify affected services and modules.
3. Change one reviewed setting group at a time. Use environment-approved paths, addresses and identities; never copy secrets into a change record.
4. Save, refresh or restart the affected runtime as required, then test one representative integration.
5. Promote the reviewed change rather than recreating it manually in production where a governed promotion path exists.

General Setup controls shared paths, runtime/log behaviour, notifications, service/API behaviour and other system-wide options. Use the complete group references below rather than guessing from an unfamiliar label:

- [System and runtime](system-and-runtime.md)
- [Database](database.md)
- [Email and SMTP](email-and-smtp.md)
- [Network and proxy](network-and-proxy.md)
- [API and web](api-and-web.md)
- [Retry, cache and performance](retry-cache-and-performance.md)
- [Logging and reporting](logging-and-reporting.md)

If a change fails, restore the recorded value, reload the affected runtime and verify logs. A saved value is not proof that the service account can access a folder, database or endpoint.

- [Configuration contexts](../environments/index.md)
- [Control services](../service-control/index.md)
