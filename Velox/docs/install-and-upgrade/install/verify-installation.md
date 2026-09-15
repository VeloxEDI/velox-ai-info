---
title: "Verify a Velox installation"
description: "Confirm Designer, databases, services, folders and logs operate correctly"
sidebar_position: 40
slug: /installation/verify-installation
classification: public
status: approved
owner: Cam Hart
keywords: [verification, services, logs]
---

Complete this commissioning check before enabling schedules, file monitors, inbound Transports or production API traffic.

## Verification procedure

1. Confirm the deployed release and architecture match the approved manifest.
2. Start Designer and load the intended production or test system connection.
3. Confirm configuration, logging and data database connections and expected schema versions.
4. Open installed Help and the Code Library; confirm shared folders and required templates/schemas are readable.
5. Start Velox Service and, where deployed, Velox API Service. Confirm Windows reports them running and inspect their startup logs.
6. Test configured file/network/database access as each service identity.
7. Run a sanitised, reversible Flow through its expected path and verify output, status and logs.
8. If API is deployed, test a non-destructive endpoint through the approved authenticated front end.
9. Confirm backup, monitoring, retention and recovery ownership before enabling automation.

## Acceptance record

Record release/checksum, host, database versions, service identities (not passwords), test case, results, log references, exceptions and approver. Any unexplained error, missing asset or version mismatch blocks production enablement.

## If verification fails

Keep automated triggers disabled. Preserve logs and configuration, identify whether the failure is binary, database, identity, network or integration-specific, and restore the pre-change state if the agreed recovery threshold is reached.

- [Designer orientation](../../getting-started/designer-orientation.md)
- [Operate Velox](../../operate-and-troubleshoot/index.md)
