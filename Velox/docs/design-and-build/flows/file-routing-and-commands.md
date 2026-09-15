---
title: "Route files and run commands in a Flow"
description: "Configure File Router and command-line Flow steps safely"
sidebar_position: 50
slug: /flows/file-routing-and-commands
classification: public
status: approved
owner: Cam Hart
keywords: [file-router, command-line, flow-step]
---

File Router and Command Line steps cross operating-system security boundaries. Test them under the actual Designer or service identity with isolated files and approved executables.

## File Router

A File Router requires a File Definition source and ordered route items. Each item has a script condition and destination File Connection. Velox evaluates routes in order and copies the source to the first matching destination. If none matches, it highlights the unrouted file in the log.

1. Select the source File Definition and create narrowly named route items.
2. Select each destination File Connection and write a deterministic condition using the editor/Code Library.
3. Order specific rules before fallbacks and compile every rule.
4. Run **Test Run** with fictional files. Current test mode evaluates routes and reports the intended destination without copying.
5. Perform one controlled real run, then verify source lifecycle, destination filename/content, permissions and log.

## Command Line

The step can process Velox tags in the executable/command and parameters, use shell execution, optionally wait for completion and apply a post-run delay. When it waits, a non-zero process exit code is logged as an error.

1. Use an approved absolute executable/script path and fixed safe arguments. Do not construct commands from untrusted filenames or payload fields.
2. Prefer the service identity and operating-system controls over stored alternate-account credentials.
3. Select shell execution only when the operation requires shell/file-association behaviour.
4. Select **Wait for Process** when Flow completion must depend on its exit code; otherwise the external process can continue after the step.
5. Test in an isolated environment and verify output, exit/error log and all side effects.

:::warning Test Run can execute commands

File Router copying is suppressed in test mode, but Command Line execution is not a general dry-run boundary. A test can run the real program with real permissions and side effects.

:::

Retries can repeat copies or commands. Before rerunning, reconcile the source, destinations and external process result.

- [Flow steps](steps/index.md)
- [File Router step](steps/file-router-step.md)
- [Command Line step](steps/command-line-step.md)
- [File Connections](../connections/file/index.md)
- [Security boundaries](../../technical-reference/security-boundaries.md)
