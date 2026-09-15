---
title: "Excel definitions"
description: "Configure workbook format detection, worksheets, ranges, templates and password handling for Velox Excel File Definitions."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [Excel, XLSX, XLS, workbook, output template, File Definition]
---

An Excel File Definition reads or writes workbook data through designed worksheets/ranges. Treat workbook layout as an interface contract: a renamed sheet, inserted heading or shifted range can change the data without changing the module name.

## Workbook settings

| Setting | Default | Effect |
| --- | --- | --- |
| **Auto-detect Excel format** | Selected | Detects the workbook format, including from the applicable file/output name. Verify both `.xls` and `.xlsx` behaviour if both are accepted. |
| **Excel format** | XLSX | Explicit workbook format when auto-detection is not used. The legacy Excel enum maps to the current Excel-file type during loading. |
| **Excel password** | Empty | Workbook password. Source review shows this value is persisted as a plain string rather than through the encrypted password pattern used by DB Connections. Do not use a sensitive reusable password; tightly restrict configuration/export access. |
| **Excel template** | Empty | Output template reference/content. Runtime use is template-dependent; keep the approved template available on every runtime host and regression-test generated workbooks. |
| **File encoding/BOM** | Inherited | Text-file settings exist on the shared class but do not replace workbook-format handling. Do not reason about XLSX as plain delimited text. |

:::warning Workbook passwords are not protected secret storage
The current Excel password property is saved without the shared Velox connection-password encryption wrapper. Avoid a sensitive password and control access to configuration databases, exports, backups and support bundles.
:::

## Design and test

1. Attach a test [File Connection](../../connections/file/index.md) and select a sanitised representative workbook.
2. Decide whether the contract fixes XLS/XLSX or permits auto-detection.
3. In **Design**, map each required worksheet/range and define stable fields and types.
4. Include examples of blank cells, dates/times, numbers stored as text, formulas, merged cells and repeated rows that the interface permits.
5. If writing from a template, test on every runtime host and retain the governed template alongside deployment configuration.
6. Open generated output in an independent reader and compare sheet names, ranges, values, formats and formulas required by the contract.

Do not infer data types only from cell display formatting. Test actual underlying values, date serials and locale-dependent numbers. A workbook that opens successfully can still map the wrong range or silently produce blanks. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing a shared worksheet, field or template.
