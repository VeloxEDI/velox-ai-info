---
title: "Configure Velox service accounts"
description: "Assign least-privilege Windows identities to Velox services"
sidebar_position: 30
slug: /installation/service-accounts
classification: public
status: approved
owner: Cam Hart
keywords: [service-account, permissions, windows-service]
---

Use dedicated, managed Windows identities for Velox Service and Velox API Service. The exact rights depend on configured integrations; there is no safe universal list of broad folder or database permissions.

## Prepare the identity

1. Create or obtain an approved service identity under organisational policy.
2. Grant **Log on as a service** through the normal policy mechanism.
3. Grant read/execute access to the installed binaries and only the required access to configured ProgramData, integration and network folders.
4. Grant only the required database roles and network/service access.
5. Store the password through the approved account-management process; do not place it in scripts or documentation.

## Assign and test

1. Stop the affected service during the change window.
2. Assign the identity through the approved Velox service setup workflow or Windows service management procedure.
3. Start the service and verify its Windows status and Velox logs.
4. Test database, file-share, certificate/private-key and endpoint access as that identity.
5. Run one controlled Flow or API check appropriate to the service.

If startup fails, restore the previous known-good identity when policy permits, retain the service/logon error and check password, logon right, filesystem, database and network access separately.

## Related tasks

- [Control Velox services](../../administer-velox/service-control/index.md)
- [Verify the installation](../install/verify-installation.md)
- [Review security boundaries](../../technical-reference/security-boundaries.md)
