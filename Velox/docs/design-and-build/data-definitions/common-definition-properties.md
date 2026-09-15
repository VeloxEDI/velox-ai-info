---
title: "Common Data Definition properties"
description: "Understand the shared module, string handling and Connection relationships of Velox Data Definitions."
sidebar_position: 25
classification: public
status: approved
owner: Cam Hart
keywords: [Data Definition properties, string trim, truncate, File Connection]
---

Data Definitions inherit common module identity/state and add shared data-lifecycle behaviour.

| Property | Type/default | Effect |
| --- | --- | --- |
| File Connection reference / `FileConFIDS` | module GUID / empty | Links a File Definition to its File Connection |
| Disable string trim / `DisableStringTrim` | Boolean / `true` | Controls base string trimming behaviour; distinguish it from file-specific `TrimStrings` |
| Truncate strings / `TruncateStrings` | Boolean / `false` | Allows values to be truncated to field sizes; can hide source-data quality problems |
| Active/runtime request/response/data state | runtime only | Assigned by Flow/API execution; not a persisted configuration field |

The Definition owns data views/fields and is referenced by identity. Changing its shape can invalidate Maps, Reports, parameters and scripts even when the module still saves. Validate every dependent design and a representative runtime Flow.
