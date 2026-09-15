---
title: "Compare and verify configuration"
description: "Use structural comparison plus behavioural evidence to verify Velox configuration."
sidebar_position: 70
classification: public
status: approved
owner: Cam Hart
keywords: [Compare with Prod, DiffMerge, verification, configuration comparison]
---

**Compare with Prod** and importer comparison create temporary `.CFG` representations and can open the configured DiffMerge tool. A text difference identifies serialised configuration differences; it does not determine whether a change is safe, complete or functionally equivalent.

## Comparison procedure

1. Confirm which context is on each side and record the selected module identity.
2. Compare the top-level module and every included dependency.
3. Classify differences as intended functional change, target-specific value, generated/metadata difference or unexpected drift.
4. Do not copy production credentials, hosts, paths or endpoints into test, or test values into production, merely to eliminate a difference.
5. If DiffMerge editing is enabled in General Setup, treat edits as high risk. Prefer correcting the source module and regenerating the comparison/package.
6. Retain the approved summary or checksum, not uncontrolled temporary files containing sensitive values.

## Behavioural verification

After import or promotion, verify module relationships, Connection tests under the runtime identity, representative Flow result/status, output content, Transport Log delivery outcome, API contract where relevant and service refresh state. Compare external-system state before declaring success.

A clean comparison plus a failed runtime test is a failed change. A deliberate environment-specific difference plus successful governed tests may be correct. See [promote configuration](promote-configuration.md) and [governance evidence](governance-approvals-and-evidence.md).
