---
title: Value
description: Reads or mutates node-kind-specific UTF-8 content, with aggregate element text and restrictive mixed-content behavior.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, value, text, cdata, utf8, mixed-content]
---

```Delphi
property Value: UTF8String read write;
```

### Example

```Delphi
procedure SetSimpleElementText(Node: TXMLNode);
begin
  if (Node <> nil) and (Node.ElementType = xeElement) and
     (Node.ElementCount = 0) then
    Node.Value := 'Ready';
end;
```

### Usage

`Value` reads or mutates node-kind-specific UTF-8 content, with aggregate element text and restrictive mixed-content behaviour.

### Additional Technical Info
`Value` is a virtual node-kind-specific property. Check [`ElementType`](../Methods/ElementType.md) before assuming how a read or write behaves.

For an ordinary element, reading Value scans its immediate raw children and concatenates the values of every `xeCharData`, `xeWhiteSpace` and `xeCData` node in stored order. It does not include descendant-element text. This can allocate a new string proportional to the combined immediate text size on every read.

Element assignment is intentionally restrictive:

- it raises `Can not set text value when there are several text subnodes` when more than one character-data node exists, or when any whitespace or CDATA node exists;
- when no value node exists, it right-trims the supplied text, inserts one character-data node at the native direct-content boundary and stores the trimmed result;
- when one tracked character-data node already exists, it updates that node with the original untrimmed value; and
- when the right-trimmed new value is empty, it removes the tracked value node.

The first-assignment versus update paths therefore differ: trailing whitespace is removed when the character-data node is first created, but can be retained on a later update. An element with mixed text/CDATA/whitespace cannot even be cleared through this setter because the mixed-content check occurs first. Structural changes are immediate and can shift sibling indices/references.

For attributes and character-data nodes, Value reads decoded/replaced text and writing normalizes line endings and escapes content into the document symbol table. CDATA stores its literal value. Other node classes provide their own implementation or can reject assignment through the base `Cannot set value` exception.

`UTF8String` is a PascalScript `AnsiString` alias. Supply UTF-8 bytes for non-ASCII data. The writer handles XML escaping for character/attribute nodes; do not pre-escape normal text or it can be double escaped. This property performs no schema or business validation.

The example is source-reviewed only; no value was assigned.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - virtual value implementations and element mixed-text mutation rules.
- [W3C XML character data](https://www.w3.org/TR/xml/#syntax) - XML character-data and markup rules.
- [W3C XML CDATA sections](https://www.w3.org/TR/xml/#sec-cdata-sect) - CDATA semantics relevant to mixed content.

<small>Created 2026-07-15</small>
