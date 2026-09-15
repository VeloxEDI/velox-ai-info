---
title: "Velox data-format reference"
description: "Compare database, flat, XML, JSON, EDI, Excel and stream use"
sidebar_position: 50
slug: /advanced/data-format-reference
classification: public
status: approved
owner: Cam Hart
keywords: [data-format, xml, json, edi]
---

| Format | Configuration owner | Structure/options to verify | Runtime boundary |
| --- | --- | --- | --- |
| Database | DB Connection + DB Definition | Provider/method, query/table/fields, parameters, key/update rules, SQL dialect | Driver architecture, identity/permissions, pool and transaction/isolation behaviour are deployment-specific |
| Delimited/fixed text | Flat File Definition | Encoding/BOM, delimiter/fixed positions, quote/escape, line ending, header/footer/record layout, invalid-data policy | Test empty/null/short/long/quoted/newline fields and round-trip output |
| XML | XML File Definition | Root, namespace, element/attribute mapping, schema and validation settings | Generated XSD requires review; external resources/DTD resolution create a security boundary |
| JSON | JSON File Definition | Root/array/object structure, property names/types and output formatting | Loaded sample/`JSONSchema` structure is not proof of runtime JSON Schema-standard validation |
| EDI | EDI File Definition | Standard/message/version, segments/composites, separators/terminators, release/character code and partner profile | A generic format option does not certify a partner implementation/version |
| Excel | Excel File Definition/template | Workbook/template, sheet/range, headers/types/formulas, row/column layout and password | Provider/architecture and template availability must be tested on the runtime host; workbook password is sensitive persisted configuration |
| Stream/request body | REST request/response Definition or script | Content type, charset, body schema and status/error contract | Gateway forwarding, size/time limit and generated OpenAPI alignment must be verified |

## Cross-format rules

- Define null, empty, missing, invalid, duplicate and extra-field behaviour explicitly.
- Preserve encoding and line-ending expectations; a visually correct sample can still contain different bytes.
- Use sanitised representative minimum, typical, maximum and malformed samples.
- Test both reading and generated output when Velox writes the format.
- Treat ignore/continue options as controlled business decisions, not convenient error suppression.
- Validate the receiving application's interpretation, not only Velox parse success.

Use sanitised representative samples, define missing/empty/invalid behaviour and test round-trip output where applicable. A menu option or installed example does not certify every standard/version.

- [File Definitions](../design-and-build/data-definitions/file/index.md)
- [Maps](../design-and-build/transformations-output/maps/index.md)
- [REST Flows](../design-and-build/apis-and-openapi/rest-flows.md)
- [Configuration-field index](configuration-field-index.md)
