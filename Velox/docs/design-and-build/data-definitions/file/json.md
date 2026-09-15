---
title: "JSON definitions"
description: "Configure sample-driven JSON structure, root shape, paths, arrays and null output in a Velox File Definition."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [JSON, JSON Root Type, array, object, File Definition]
---

A JSON File Definition maps object and array structures to Velox dataviews and fields. The current setup control labelled **JSON Schema** consumes a JSON instance/sample for the design outliner; source review found no active runtime JSON Schema validator. Do not claim standards-based schema validation from this field.

## Configuration

| Setting | Default | Runtime/design effect |
| --- | --- | --- |
| **JSON Schema** / `JSONSchema` | Empty | File path or string processed with `<DEFAULTDIR>` substitution and loaded as a JSON sample by the outliner. Use sanitised representative content. |
| **JSON Root Type (for writing)** / `JSONRootType` | Not set | Selects the output root shape, normally object or array. The property is runtime/public rather than a normal published base setting, so always reopen and verify the design/output behaviour. |
| **Use `xsi:nil` for nulls** | Cleared | Despite its XML-derived name, the JSON engine reuses this flag as its output-null control. Test whether the receiver expects explicit `null` or omitted properties. |
| **File encoding and BOM** | ANSI / BOM cleared | Inherited file settings. Use the actual JSON interface contract, commonly UTF-8, and verify raw bytes. |
| **Auto-detect encoding / attempt other** | Selected / selected | Input encoding fallbacks. Explicitly test non-ASCII characters. |

## Model the payload

1. Choose samples that include every optional property, each array shape, nulls, empty arrays/objects, minimum and maximum values, and representative Unicode text.
2. Attach a test [File Connection](../../connections/file/index.md), select the sample, and open **Design**.
3. Create stable dataviews for nested/repeating structures and fields with reviewed types.
4. Select the output root type when the Definition writes JSON.
5. Test both a single logical record and multiple/repeating records.
6. Compare generated output with the receiving contract, including property names/case, nesting, array cardinality, numbers versus strings, explicit nulls and encoding.

The outliner can only infer structures present in its sample. A field omitted from the sample may never enter the design, while a single-item array may conceal cardinality issues. Keep a governed sample suite outside production inbound folders.

## Validation and failure policy

Use independent contract tests when the interface specifies JSON Schema; Velox's current JSON setup is sample-driven rather than a runtime JSON Schema enforcement point. Do not enable shared options that ignore extra fields, invalid numbers or truncation merely to accept an unexpected producer change. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing paths or types referenced by other modules.
