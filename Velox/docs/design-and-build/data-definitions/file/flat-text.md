---
title: "Flat text, CSV and fixed-width definitions"
description: "Configure delimiters, fixed-width fields, quoting, encoding, exclusions and invalid-data policy for flat File Definitions."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [flat file, CSV, fixed-width, delimiter, encoding, File Definition]
---

Velox uses one flat File Definition type for delimited text such as CSV and for fixed-width records. **Delimited Fields?** selects the parsing model; CSV is not a separate module type.

## Parsing and writing settings

| Setting | Default | Runtime effect |
| --- | --- | --- |
| **Delimited Fields?** / `Delimited` | Cleared | When selected, fields are separated by `Delimiter`; otherwise designed positions and lengths define fixed-width fields. |
| **Field Delimiter** / `Delimiter` | `44` (comma) | Integer character code used between delimited fields. Common values include `9` for tab, `44` for comma and `124` for pipe. |
| **Record Delimiter** / `RecDelimiter` | CRLF | Record boundary mode. Choose the contract's line break; select custom only when a literal custom boundary is required. |
| **Custom Record Delimiter** | Empty | Used only when record delimiter is custom. Test whether the value represents the exact characters required by the engine. |
| **Quote strings** | Cleared | Quotes string fields on output. |
| **Quote character** | `34` (double quote) | Integer character code used for quoting. |
| **Quote any data type** | Cleared | Extends output quoting beyond strings. Use only when the receiving contract requires it. |
| **Excluded top / bottom** | `0` / `0` | Skips the configured number of leading or trailing lines during input. Use for governed headers/trailers, not to suppress unexplained records. |
| **Text encoding** | ANSI | Initial encoding. Input auto-detection is enabled by default and may select a different encoding. |
| **Write BOM** | Cleared | Writes a byte-order mark where supported. A BOM is part of the interface contract; some consumers reject it. |
| **Print header row** | Cleared | Writes field headings for formats/designs that support a header. |
| **Trim strings** | Cleared | Trims strings in file processing. This is distinct from the inherited **Disable string trim** setting. Test their combined effect. |
| **Extended characters allowed** | Cleared | Allows extended characters in the file engine. Encoding still has to represent them correctly. |
| **Auto-detect record delimiter** | Cleared | Attempts to infer record boundaries. Prefer an explicit contract for production. |
| **Auto-detect encoding** | Selected | Detects input encoding. |
| **Attempt other encoding** | Selected | Tries alternate encodings after a problem. This may help compatibility but can make a supplier's encoding defect less obvious. |
| **Enable null in data** | Cleared | Permits null bytes/data that would otherwise stop normal loading. Enable only for a documented source contract. |

## Invalid-data policy

All ignore options default to cleared: invalid lines, extra fields, invalid numbers, undefined records, null records, truncated field data and invalid date/time format-mask warnings. Keep them cleared while commissioning. An ignored error can turn a rejected business record into incomplete data without correcting the source.

If an exception is necessary, document which records are skipped or values changed, how the event is logged/reconciled, and how the sender is corrected. Test counts and rejected examples as well as the successful result.

## Design the record model

1. Attach a test [File Connection](../../connections/file/index.md) that points to sanitised samples.
2. Select delimited or fixed-width processing and set the exact encoding and boundaries.
3. In **Design**, create a dataview for each record type and stable record identifier.
4. For delimited records, order fields exactly as supplied. For fixed-width records, define non-overlapping positions, lengths and data types.
5. Model header/detail/trailer relations where applicable.
6. Test minimum, maximum, blank, null, quoted-delimiter, embedded-line-break, invalid-number and encoding cases.
7. Write a sample and compare bytes—not only visible text—with the agreed contract.

At runtime, `FileNo` starts at `1`; the engine calculates fixed-length size and owns parser/writer state. These are runtime values, not settings to edit. Changing field order, position, size, type or record identifier can break every consuming Flow, Map and Report. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing a shared Definition.
