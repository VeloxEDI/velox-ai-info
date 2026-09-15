---
title: "Install the Velox platform"
description: "Deploy approved Velox binaries and shared assets on Windows"
sidebar_position: 10
slug: /installation/install-velox
classification: public
status: approved
owner: Cam Hart
keywords: [install, programdata, windows]
---

This procedure deploys an approved release to a new Windows environment. Exact package names and commands are release-controlled; do not run repository development, beta, trial or historical batch files unless the supplied runbook explicitly selects them.

## Before you begin

Complete the [prerequisite checklist](../plan/prerequisites.md). Use a Windows administrator account, obtain the approved package and checksum, and confirm that this is a clean installation rather than an upgrade.

## Install

1. Record the host starting state and verify the package checksum.
2. Unblock or scan the package according to organisational policy, then stage it in a protected local folder.
3. Follow the release runbook to copy or install the matching Velox executable set and required runtime libraries.
4. Deploy the matching shared ProgramData assets. Preserve their folder hierarchy; do not merge assets from another release.
5. Create the approved `Connections.json` and other environment configuration from supplied templates without committing credentials to source control.
6. Configure databases and service identities before starting background processing.
7. Retain the package, checksum and deployment log for recovery.

## Verify and recover

Confirm expected executables and `C:\ProgramData\Velox\` assets exist, then follow [Verify a Velox installation](verify-installation.md). If deployment fails before processing starts, remove only files created by the recorded attempt or restore the pre-install snapshot. Do not delete an existing ProgramData tree whose ownership is uncertain.

## Troubleshooting

- Architecture/load errors: verify executable, client library and driver architecture match.
- Missing Help or templates: redeploy ProgramData assets from the same approved release.
- Access errors: test as the actual interactive or service identity, not only as an administrator.
- Unknown package contents: stop and obtain a release manifest; do not guess from repository folder names.
