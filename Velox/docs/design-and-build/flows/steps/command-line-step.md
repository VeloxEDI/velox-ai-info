---
title: "Configure a Command Line step"
description: "Configure executable, parameters, optional credentials, shell mode, waiting, exit handling and delay for a Flow command."
sidebar_position: 80
classification: public
status: approved
owner: Cam Hart
keywords: [Command Line step, ShellExecute, process, exit code, service account]
---

A Command Line step starts a local process from the Designer or Velox service host. It is a high-privilege integration boundary: tags are evaluated into the command/parameters, and Test Run still executes the real process.

## Settings

| Setting | Default | Runtime effect |
| --- | --- | --- |
| **Command line** | Empty | Executable/command text after Velox tag processing. Use an approved absolute executable path. |
| **Parameters** | Empty | Tag-processed argument text. Validate and quote untrusted values; do not concatenate arbitrary payload text into a shell. |
| **Use Shell Execute** | Cleared | Selects the Windows shell execution path instead of the direct process path. Shell associations add environment-dependent behaviour. |
| **User name / password / domain** | Empty | Optional alternate run-as identity. Password uses Velox encrypted persistence, but least privilege and configuration access controls still apply. Prefer the governed service identity where possible. |
| **Wait for process** | Cleared | Waits for completion so applicable exit failure can affect the Flow. If cleared, later steps can run while the child process is still active and its eventual result is not a synchronous Flow result. |
| **Delay** | `0` seconds | Sleeps after starting/completing the command. It is not a readiness or success check. |

## Safe procedure

1. Approve the executable, path, arguments, working/resource assumptions and service identity.
2. Avoid shell mode unless an association/shell feature is required.
3. Use **Wait for process** when later steps require completion and test success/non-zero exit behaviour.
4. Test spaces, quotes, missing files, timeouts/long runs, simultaneous runs and least-privilege access.
5. Capture useful output in a governed way without exposing secrets.

Do not use a fixed delay to infer that an asynchronous process finished. Do not run an interpreter with untrusted input. Repeated Flow attempts can start the command again, including after the first process already changed external state. See [route/command overview](../file-routing-and-commands.md) and [concurrency](../runtime/ordering-concurrency-and-transactions.md).
