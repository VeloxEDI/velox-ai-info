---
title: "XML definitions"
description: "Configure XSD loading, validation, schema roots, namespaces, null handling and XML output in a Velox File Definition."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [XML, XSD, namespace, DTD, File Definition, validation]
---

An XML File Definition turns an XML/XSD contract into Velox dataviews and fields. Schema and namespace settings affect both the design model and runtime output, so preserve the governed XSD and representative instances with the integration contract.

## Schema and validation

| Setting | Default | Behaviour |
| --- | --- | --- |
| **Blank XML** | Empty | Stored blank/template XML content used by the definition where applicable. |
| **XSD Schema** | Empty | XSD schema content/reference loaded by the XML engine and setup form. |
| **Schema Location** | Empty | Schema location written or consumed where configured. Ensure the runtime host can resolve any referenced resources. |
| **Target Namespace** | Derived from loaded schema | Namespace obtained from the schema when available. Confirm it after every schema replacement. |
| **Validate XML** | Selected | Enables XML validation against the configured schema. Keep enabled unless the contract explicitly permits unvalidated instances. |
| **Resolve Externals** | Selected | Allows external references to be resolved. Restrict schemas and runtime access to trusted, controlled resources. |
| **Fix Bad Encoding** | Cleared | Attempts to repair an encoding problem. Use only with known samples because repair can conceal a producer defect. |
| **Multiple Root Nodes** | Cleared | Indicates that the schema exposes several possible roots. Root selection is tracked by index and name. |
| **Schema Root Node** | Index `-1`, name empty | Root selected for a multiple-root schema. Recheck after the schema changes. |
| **Allow DTD References** | Cleared | Controls whether the MSXML validation path permits DTD processing. Keep disabled unless trusted input, network/file resolution and entity-expansion risks have been explicitly accepted. |

`Resolve Externals` defaults to selected while DTD references default to disabled. They are separate controls. External XSD imports/includes can still create availability and trust dependencies; package or host them according to the deployment design.

## Output and namespace settings

| Setting | Default | Behaviour |
| --- | --- | --- |
| **Include XSI namespace** | Selected | Includes the XML Schema instance namespace. |
| **Include XSD namespace** | Selected | Includes the XML Schema namespace. |
| **Include XML prolog** | Selected | Writes the XML declaration. |
| **Target namespace name** | Empty | Prefix/name paired with the target namespace configuration. |
| **Namespaces as needed** | Cleared | When selected, emits namespaces where needed rather than using the normal global placement. |
| **Use `xsi:nil` for nulls** | Cleared | Serialises eligible null values using `xsi:nil`. Verify nullable/nillable schema rules. |
| **UTF-16 encoding** | Cleared | Uses UTF-16 XML behaviour. Coordinate this with file encoding, prolog and BOM requirements. |
| **Force attribute namespace prefix** | Cleared | Forces prefixes on attributes. |
| **Use `xsi:type`** | Cleared | Emits dynamic type information where configured. |

Abstract, `xs:any` and array assignment lists start empty and store explicit schema-design mappings. Treat them as part of the versioned schema contract.

## Configure and test

1. Attach a test [File Connection](../../connections/file/index.md) and load the approved XSD plus representative XML.
2. Select the correct root and inspect the generated dataview hierarchy.
3. Map namespaces, repeating elements, attributes, optional values and nulls deliberately.
4. Validate known-good and known-invalid instances. Confirm the invalid sample fails for the expected reason.
5. Test output against the receiving system or an independent XSD validator, including prolog, encoding, prefixes and null values.
6. Repeat tests after any XSD, root or namespace change.

Do not enable DTDs or broad external resolution to make an untrusted document load. If the schema changes dataview or field identities, use [Check Usage](../../../administer-velox/modules-and-folders/index.md) and retest every dependent module.
