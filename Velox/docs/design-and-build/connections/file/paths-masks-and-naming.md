---
title: "File Connection paths, masks and naming"
description: "Configure File Connection folders, input masks and safe output names."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [File Connection, file mask, filename, DEFAULTDIR]
---

## Configuration options

| UI purpose / property | Type/default | Runtime effect and conditions |
| --- | --- | --- |
| File name / `FileName` | tag-capable string / empty | Output naming template; supports runtime/data tags plus `<FILENO>` and `<COUNTER>` |
| File pattern / `FilePattern` | tag-capable pattern / `*` | Selects inbound files and can contribute to Transport output naming |
| Main folder / `FileDir` | path / `<DEFAULTDIR>\` | Primary read/write folder; setter enforces a trailing delimiter and derives default subfolders |
| Counter / `EnableCounter` | Boolean / `false` | Enables database-backed `<COUNTER>` increments |
| Unique file name / `UniqueFileName` | Boolean / `true` | Generates a unique destination rather than overwriting an existing file |
| Ensure safe filename / `EnsureSafeFileName` | Boolean / `true` | Applies safe-filename processing after tag expansion |
| Inbound naming / `InboundFileNaming` | incoming/name-selection enum / use incoming | Chooses how received Transport data is named locally |

`<DEFAULTDIR>` resolves through General Setup **Default file path**. Validate the processed absolute path under the runtime account. Tags can produce different names for different records/runs; test collisions, invalid characters and empty values.

## Configure and test

1. Create/open a File Connection and choose a descriptive name.
2. Set the main folder and narrowest safe input pattern.
3. Configure output naming and keep safe/unique naming enabled unless a reviewed overwrite contract requires otherwise.
4. Save, create the required folders and test read/create/move access as Velox Service.
5. Run a controlled File Definition/Flow and inspect the actual processed path plus file log events.

Continue with [post-processing behaviour](read-write-and-post-processing.md) and [locking/failure](locking-retries-and-failure.md).
