---
title: "Update your local Velox documentation"
description: "Refresh the governed Velox Help, Code Library, schemas, scripts and supporting data checkouts."
sidebar_position: 100
classification: public
status: approved
owner: Cam Hart
keywords: [update documentation, Update Velox Data, Code Library refresh, ProgramData]
---

The public site and the in-product Code Library are built from the same governed documentation source. Use the installed update script to bring the local managed copies to the current upstream `main` branch:

`C:\ProgramData\Velox\_Update Velox Data from GIT.bat`

## Important destructive boundary

The script runs Git fetch, hard reset and clean operations in the managed Config, Data, Excel, Help, Schema (Velox and VeloxJSON) and Script checkouts. It intentionally discards local changes and untracked files in those managed checkout folders. Do not store local/customer work or hand-edited documentation there.

## Before updating

1. Confirm no approved local change is waiting to be moved to its governed source repository.
2. Close Designer Help/Code Library views and tools using managed files.
3. Ensure Git/network access and sufficient disk space are available.
4. Follow your organisation's change process because schemas/scripts/templates as well as Help are refreshed.

## Update and verify

1. Right-click the script and select **Run as administrator**, as required by the installed ProgramData permissions.
2. Review each checkout's fetch/reset/clean output. Do not rely only on the final `Velox Data updated!` message if an earlier Git command failed.
3. Reopen Designer and select **Help > Code Library**, then choose **Refresh** where needed.
4. Search for a known entry, open its Markdown and confirm the generated hierarchy loads. Inherited members can resolve beneath ancestor paths; the hidden generated `Classes/Common` branch is intentionally absent from navigation.
5. Verify any updated schemas/scripts/templates before using them in production work.

If the update fails, record the affected checkout path, command/error, current branch/remote state and timestamp. Do not delete/reclone the managed folders until the installation/update owner confirms the recovery. See [Code Library troubleshooting](../operate-and-troubleshoot/code-library-troubleshooting.md).
