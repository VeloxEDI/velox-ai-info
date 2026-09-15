---
title: "Configuration lifecycle"
description: "Move Velox configuration through controlled export, validation, promotion and recovery."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [configuration lifecycle, promotion, governance, rollback]
---

Velox configuration is a connected graph of modules, not a set of isolated files. A safe change moves from design and test through dependency review, controlled packaging, target-context import, comparison, production verification and recoverable evidence.

## Lifecycle

1. Identify the changed module and its [dependencies and relationships](dependencies-and-relationships.md).
2. Complete representative test execution and record the approved scope.
3. [Export and package](export-and-package.md) a controlled `.CFG` artefact, or use the context-to-context promotion command.
4. [Import and validate](import-and-validate.md) in the intended target context.
5. [Compare and verify](compare-and-verify.md) structure, environment values and behaviour.
6. [Promote configuration](promote-configuration.md) during an approved change window.
7. Retain evidence and be ready to [roll back and recover](rollback-and-recovery.md).

Configuration promotion does not deploy Velox binaries, database schema or external-system changes. Coordinate those through the relevant installation/upgrade and external change processes.

Use [configuration templates](configuration-templates.md) for the product mechanics and [governance, approvals and evidence](governance-approvals-and-evidence.md) for the minimum change record.
