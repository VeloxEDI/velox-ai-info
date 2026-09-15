---
title: "Configure Velox services"
description: "Configure Velox Service and Velox API Service with the correct connection key, identity and runtime access."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Velox Service, Velox API Service, Windows service, connection key]
---

Configure each Windows service for one deliberate Velox system connection and environment. The Windows service account, `Connections.json` profile, General Setup and filesystem/database permissions must agree.

## Before you begin

- Use an elevated administrator account for service installation or credential changes.
- Complete [service-account planning](../plan/service-accounts.md) and [database configuration](configure-databases.md).
- Confirm the selected `Connections.json` **Key** has a non-empty **DisplayName**, non-zero **ConfigNum** and resolvable Config/Test/Log/Data database keys.
- Back up current service configuration before replacing an existing service.

## Runtime parameters

| Parameter | Requirement | Effect |
| --- | --- | --- |
| `-c <key>` | Required | Selects the named system connection from `Connections.json`. A missing or invalid key prevents normal configuration loading. |
| `-n <name>` | Required by current startup parameter construction | Distinguishes the service/display identity. Keep names unique and operationally meaningful. |
| `test` flag/signature | Include only for the intended test service | Selects test database roles and test naming suffixes. Absence selects production. |

## Configure and start

1. Open Velox Designer for the intended connection and environment.
2. In General Setup, review service state/users and the API port or other runtime settings that apply.
3. Install or update Velox Service and, where REST Flows are required, Velox API Service using the approved service identity.
4. Grant **Log on as a service** and only the database, ProgramData and endpoint permissions the process needs.
5. Confirm the service image path and parameters contain the intended connection key, unique name and environment selection.
6. Start one service at a time. Check Windows service state and the Velox/system logs before starting the next.
7. In Designer, use **Service > View Processes** or the relevant status action to confirm communication with the correct service instance.

## Verify the result

- Velox Service loads the expected active Flows and exposes status/process information.
- Velox API Service listens on the planned port and a controlled REST Flow test returns the documented result.
- Scheduled/monitored work remains disabled until the installation verification is complete.
- No password, token or private key appears in command output or change evidence.

If a service starts and stops immediately, check the connection key, database/schema availability, service-account rights and ProgramData access before changing product settings. See [service troubleshooting](../../operate-and-troubleshoot/service-troubleshooting.md).
