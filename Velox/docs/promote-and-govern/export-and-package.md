---
title: "Export and package configuration"
description: "Create a controlled Velox configuration package with a reviewed dependency scope."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [export, CFG, package, checksum, dependency scope]
---

Export produces a serialised `.CFG` configuration template. Treat the file as sensitive and version-specific: it can contain scripts, credentials or environment addresses and its internal structure is owned by Velox.

## Before export

- Confirm Designer is connected to the intended source context and the selected module is saved.
- Run the module successfully with representative fictional/test data.
- Review usage and dependencies, including shared modules and linked successors.
- Record product version, source context, module name/FID, scope, approver and intended target.

## Export and package

1. Select the module and choose **Export**.
2. Resolve any message that a referenced module is not configured or cannot load; do not distribute a partial package.
3. Save the `.CFG` to a protected staging folder using a release/change identifier.
4. Record file size, timestamp and a cryptographic checksum using the organisation's approved tool.
5. Store the package with its dependency/change manifest and test evidence. Restrict access and retention according to the most sensitive setting it contains.
6. Transfer using an approved integrity-protected channel. Do not email or paste raw template content into tickets or AI prompts.

Do not manually edit the serialised `.CFG` file. If scope or settings are wrong, correct the source modules, retest and export again. Installed template folders may contain development, backup or customer/scenario artefacts; use one only when its owner, compatibility and purpose are explicitly approved.

Next, [import and validate](import-and-validate.md). For direct test/production context movement, use [promote configuration](promote-configuration.md).
