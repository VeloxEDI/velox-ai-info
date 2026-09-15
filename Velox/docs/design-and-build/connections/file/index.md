---
title: "Configure a File Connection"
description: "Configure folders, masks, naming and file lifecycle behaviour"
sidebar_position: 10
slug: /data/file-connections
classification: public
status: approved
owner: Cam Hart
keywords:
  - "file-connection"
  - "folders"
  - "files"
---

Create a reusable file endpoint in Velox Designer. The File Connection controls where Velox finds files, how it names output and where it places files during normal or exceptional processing.

## Before you begin

- **Audience:** Velox implementers and administrators.
- **Prerequisites:** An agreed file-lifecycle design, including the input/output, audit, error, issue and duplicate locations that the workload needs.
- **Permissions:** Permission to create Velox configuration modules and folder permissions for both the configuring user and the runtime service account.
- **Starting state:** Use a test environment with sanitised files. Confirm whether a Flow, transport or file monitor will use the endpoint.

:::warning Prevent reprocessing and data loss
Do not point a new File Connection at a live inbound folder until its search pattern and post-processing behaviour have been tested. An overly broad pattern can collect unintended files; incorrect folder permissions can leave files in place for repeated processing.
:::

## Steps

1. In the Designer configuration tree, open **Data Connections > File Connections** and create a File Connection.
2. Enter a unique **File Endpoint Name** that identifies the purpose and environment.
3. Set **File Directory** to the main working location. Velox derives default audit, error, issue and duplicate subfolders when the main directory changes; review every derived path before saving.
4. Set **File Search Pattern** to the narrowest pattern that matches the intended inbound files, such as `orders-*.csv`. Avoid `*` for an active shared folder.
5. Set **File Name** when Velox will create output files. The name may use configured runtime tags; `<FILENO>` provides a per-run file number and `<COUNTER>` uses the persistent counter when that option is enabled.
6. Review **Audit Directory**, **Error Directory**, **Issue Directory** and **Duplicate Directory**. Use separate locations so operators can distinguish completed, failed, held and duplicate files.
7. Keep **Make the filename unique if it already exists** enabled unless replacement behaviour has been explicitly designed and tested.
8. Keep **Replace any invalid filename characters with a dash** enabled unless a receiving system requires another verified naming rule.
9. If an inbound transport uses this Connection, choose the required option under **Inbound Transport file naming**. Test the resulting name with the transport rather than assuming the remote name will be preserved.
10. Select **Create Dirs** to create or check the configured working folders, then select **Save**.

## Verify the result

Open each configured folder using the runtime service account and confirm that it can perform only the required read, create, rename, move and delete operations. Place a sanitised test file that matches the search pattern in the test directory, then verify that an assigned test Flow or monitor selects it once and moves it to the expected final location.

The folder check creates the main, audit, issue, error, duplicate and temporary directories. Confirm a transport directory separately when the design uses one.

## Recover or roll back

Disable or stop the consuming test workload before changing paths. Move test files back to their original controlled location, restore the previous Connection values and rerun the folder-permission check. Remove newly created empty folders only under your organisation's file-retention procedure.

## Troubleshoot

- **Create Dirs fails:** check the expanded path and the configuring user's create-folder permission.
- **Designer can browse but the service cannot process:** grant the required access to the runtime service account; mapped drives and interactive-user sessions may not be available to a Windows service.
- **No files are selected:** check the exact directory, search pattern and filename case rules of the underlying file system.
- **A file is processed repeatedly:** confirm that successful processing moves it out of the monitored path and that the service account can perform the move.

## Next steps

Describe the file structure with a [File Definition](../../data-definitions/file/index.md). Read [Connection concepts](../connection-concepts.md) before reusing this endpoint across workloads. The detailed references cover [paths, masks and naming](paths-masks-and-naming.md), [read/write post-processing](read-write-and-post-processing.md), and [locking, retries and failure](locking-retries-and-failure.md).
