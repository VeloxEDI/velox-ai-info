---
title: "Configure File Definitions"
description: "Define flat, CSV, XML, JSON, EDI and Excel data"
sidebar_position: 10
slug: /data/file-definitions
classification: public
status: approved
owner: Cam Hart
keywords:
  - "file-definition"
  - "xml"
  - "json"
  - "edi"
  - "excel"
---

A File Definition describes the structure and serialisation rules of file-backed data. Velox provides separate setup forms for flat/CSV, XML, JSON, EDI and Excel Definitions.

## Scope

This reference helps implementers choose a File Definition type and identify its main verified settings. A File Connection supplies the folders and names; the File Definition supplies the format, dataviews and fields.

## Choose a format

| Format | Use when | Principal configuration |
| --- | --- | --- |
| Flat file or CSV | Records use fixed positions or delimiters | Record and field delimiters, quote character, excluded lines, encoding, headers and invalid-record handling |
| XML | The payload is XML and may be described by an XSD | XSD, schema root, namespaces, validation, DTD policy, encoding and XML prolog |
| JSON | The payload uses object or array structures | Sample/schema source, root type for writing, dataview paths, null output and encoding |
| EDI | Records are segments with element and component delimiters | Segment terminator, element/component delimiter, escape character, record-delimiter detection and encoding |
| Excel | Data is read from or written to workbooks | XLS/XLSX format, worksheet/range mappings, optional output template and workbook password |

CSV is configured as a delimited flat file; it is not a separate File Definition type.

Use the dedicated references for [flat text/CSV/fixed-width](flat-text.md), [XML](xml.md), [JSON](json.md), [EDI](edi.md) and [Excel](excel.md). Each page records the complete type-specific defaults and implementation quirks.

## Common settings and actions

| Setting or action | Accepted value | Effect and constraints |
| --- | --- | --- |
| **File Definition Name** | Unique descriptive text | Identifies the Definition to consuming modules. |
| **File Connection** | An existing File Connection | Supplies the runtime file path, search pattern and output name. A missing assignment prevents file access. |
| **DB Connection** | An existing DB Connection when the design requires one | Makes database-backed design data available; it does not replace the File Connection. |
| **Design** | Opens the format-aware data designer | Defines dataviews, record/root paths, fields, types and parent/detail relationships. |
| **Test File Load** | A sanitised representative file | Loads a file using the current definition so that parsing and field mappings can be checked. |
| **Settings** | Shared definition settings | Provides additional definition behaviour used by the selected format and dataview design. |

## Format settings

### Flat files and CSV

Set **Delimited Fields?** for delimited data. A comma uses character code `44`, a tab uses `9`, and a double-quote quote character uses `34`. Configure **Record Delimiter**, **Text Encoding**, excluded top/bottom lines and header output to match the file contract. Fixed-width files leave delimited fields disabled and obtain field positions from the designed fields.

### XML

Select the **XSD Schema** and correct **Schema Root Node** when the contract uses an XSD. **Validate XML Document against XSD Schema** is enabled by default. **Allow DTD reference in XML instance** is disabled by default; enabling DTD processing requires a specific security review. Imported or included schemas must remain accessible wherever the Definition is designed and run.

### JSON

The **JSON Schema** control is used by the current design-time outliner to load a JSON instance; it does not establish runtime JSON Schema validation. Select whether writing starts with an object or array using **JSON Root Type (for writing)**, then verify every dataview and field path with representative nested and repeated data.

### EDI

Configure character codes for **Segment Terminator**, **Element Delimiter**, **Component Delimiter** and **Escape Char**. The defaults are respectively `39` (`'`), `43` (`+`), `58` (`:`) and `63` (`?`). **Auto-detect Record Delimiter** can use a leading `UNA` segment, but the Definition still needs dataview record identifiers that match the segments it processes.

### Excel

Select the workbook format or keep **Auto-detect Excel format** enabled so `.xls` or `.xlsx` output names determine the format. Dataviews identify worksheets and ranges. Use **Output Template** only with a governed template whose layout and availability are controlled with the Definition.

## Example

For this illustrative CSV record:

```csv
HDR,10045,2026-07-14
```

a flat-file Definition could use comma-delimited fields and a dataview whose record identifier is `HDR`. The actual field names, types, lengths and record identifiers must come from the agreed file contract.

## Constraints and failure behaviour

- Test both reading and writing when a Definition is used in both directions; successful parsing does not prove that output matches the external contract.
- Do not enable options that ignore invalid lines, extra fields, invalid values or truncation warnings merely to make a test pass. They can hide data-quality failures.
- Encoding, byte-order marks, delimiters, namespaces, paths, workbook ranges and null handling are part of the interface contract. Verify them with the receiving system.
- XML has active XSD-validation support when configured. Equivalent runtime JSON Schema validation was not found in the current JSON file engine.
- A File Definition without a File Connection reports that its File Connection is not set.
- Renaming dataviews or fields can break Maps, Flows, Reports, APIs and transports that consume them.

:::caution Test with sanitised copies
**Test File Load** reads a real file through the current Definition. Use a sanitised copy in a test File Connection and do not point design-time tests at an active inbound folder.
:::

## Related references

- [Data Definition concepts](../definition-concepts.md)
- [Configure a File Connection](../../connections/file/index.md)
- [Connection concepts](../../connections/connection-concepts.md)
- [Common Data Definition properties](../common-definition-properties.md)
