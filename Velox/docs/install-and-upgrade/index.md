---
title: "Install Velox"
description: "Plan, install, configure and verify a Velox environment"
sidebar_position: 10
slug: /installation/
classification: public
status: approved
owner: Cam Hart
keywords: [installation, setup, administrator]
---

This section is for Windows, database and Velox administrators commissioning or upgrading a Velox environment. Use the release-specific package and implementation runbook supplied for the environment; repository folder names and historical batch files are not installation instructions.

## Installation path

1. Check the [installation prerequisites](plan/prerequisites.md) and [deployment architecture](plan/deployment-architecture-and-ports.md).
2. [Configure service accounts](plan/service-accounts.md) and review [runtime folders](plan/runtime-folders.md).
3. [Install the Velox platform](install/install-velox.md) on the target Windows host.
4. [Configure Velox databases](install/configure-databases.md) and [services](install/configure-services.md).
5. [Verify the installation](install/verify-installation.md) before enabling production work.

For an existing environment, follow [Upgrade Velox](upgrade/index.md). Do not substitute a clean-install procedure for an upgrade.

Use [installation and upgrade troubleshooting](troubleshooting.md) when an infrastructure, database, service or post-upgrade check fails.

## Evidence to retain

Record the release identifier, package source and checksum, host and database starting state, configuration/database backups, service identities, validation results and recovery decision. Do not put passwords or private keys in the record.
