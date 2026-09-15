---
title: "File"
description: "Functions for parsing paths and reading, writing, copying, moving, deleting and monitoring files under the Velox process identity."
sidebar_position: 13
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - encoding
  - filesystem
---

The File group combines pure path-string helpers with operations that inspect or change the host filesystem. Use the path helpers to construct and decompose names; use the I/O helpers only when the active flow is authorised to access the target and its retry, replacement and encoding behavior is understood.

## Choosing an entry

- Use `ExtractFile...`, path-delimiter and extension entries for string manipulation. These do not by themselves prove that a path exists or is safe.
- Use [`FileExists`](File/FileExists.md), [`DirectoryExists`](File/DirectoryExists.md), age/size/attribute and lock entries for point-in-time observations.
- Use `LoadFile...` and `Save...` variants according to whether the contract is raw bytes, a stream or a specific text encoding.
- Use [`MakeUniqueFilename`](File/MakeUniqueFilename.md) or [`MakeUniqueFilenameNumber`](File/MakeUniqueFilenameNumber.md) only as name-selection helpers; the later file creation remains a separate operation.
- Review the exact child before destructive or external actions such as delete, purge, move, copy, directory creation or waiting for a lock.

## Path and identity model

Operations execute under the Windows identity, working environment and permissions of the Velox process handling the flow. Relative paths, mapped drives, profile folders and network shares can resolve differently between Designer and service execution. Prefer a configured absolute path and treat user- or message-derived path elements as untrusted.

String normalization is not authorization. Replacing separators or removing invalid filename characters does not prevent traversal, alternate streams, device paths, symbolic-link redirection, UNC access or a path escaping its intended root. Resolve and enforce the allowed root at the integration boundary.

## Text encoding and object ownership

The generic and explicitly named ANSI, ASCII, UTF-8, UTF-16LE and UTF-16BE helpers are not interchangeable. BOM detection, BOM retention/removal, fallback encoding and unrepresentable characters differ by entry. Specify the wire encoding instead of relying on a local default.

Stream procedures mutate caller-owned streams and can change their content and position; scripts must not free objects owned by Velox. Several operations read complete files into memory, so size must be bounded before use.

## Effects, errors and races

Existence, uniqueness and lock checks are snapshots. Another process can change the path before the next operation. Write-to-final-name, copy, move and delete calls can partially succeed or fail for sharing, permission, disk, network and antivirus reasons. Some wrappers return a Boolean, some raise, and some current adapters suppress failures or are unsafe to call; the selected child page gives the real contract.

Do not assume filesystem effects roll back when a mapping or database transaction fails. Design idempotent retries and use staging/atomic replacement where the receiving system supports it.
