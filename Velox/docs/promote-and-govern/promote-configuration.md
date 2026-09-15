---
title: "Promote configuration between environments"
description: "Move reviewed changes between test and production configuration"
sidebar_position: 60
slug: /promotion/promote-configuration
classification: public
status: approved
owner: Cam Hart
keywords: [promotion, compare, production]
---

Use **Compare with Prod**, **Update Test Config** or **Update Production Config** on applicable modules to review and move configuration. Promotion builds a configuration template and imports the selected module and dependencies into the other context; it is not a transactional deployment across configuration rows, databases, files and external systems.

## Promote safely

1. Complete testing and approval in the test context.
2. Check module usage and build the full dependency scope. Identify environment-owned Connections, credentials, variables, paths and endpoints that must not be overwritten.
3. Back up production configuration and record current service/processing state.
4. Compare the module with production. Review temporary comparison output and do not treat a text difference alone as functional validation.
5. Select **Update Production Config**, review every import action and promote only the approved modules/dependencies. Existing infrastructure modules may default to **Ignore**; verify the retained production object meets the promoted module's contract.
6. Refresh or restart affected runtimes, especially startup-loaded API routes.
7. Run a controlled production verification and inspect Flow and Transport results before restoring normal traffic.

Do not promote credentials, hostnames, paths or endpoints merely because they work in test. Verify production-specific values and permissions. Database schema changes and binaries use the upgrade process, not ordinary module promotion.

Rollback uses the approved configuration backup or prior controlled templates plus reconciliation of any completed external effects. Do not use **Update Test Config** as an improvised production rollback.

- [Configuration contexts](../administer-velox/environments/index.md)
- [Compare and verify](compare-and-verify.md)
- [Control services](../administer-velox/service-control/index.md)
- [Verify installation](../install-and-upgrade/install/verify-installation.md)
