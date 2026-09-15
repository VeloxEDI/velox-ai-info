---
title: xeInstruction
description: Identifies a general NativeXML processing-instruction node and its raw payload between the opening and closing delimiters.
sidebar_position: 204
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, processing-instruction, pi]
---

```Delphi
xeInstruction = 13
```

### Example

```Delphi
function IsProcessingInstruction(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeInstruction);
end;
```

### Usage

`xeInstruction` identifies a general Velox XML processing-instruction node and its raw payload between the opening and closing delimiters.

### Additional Technical Info
`xeInstruction` identifies a general XML processing instruction parsed from `<?...?>`, except `<?xml ...?>` and `<?xml-stylesheet ...?>`, which NativeXML classifies as [`xeDeclaration`](xeDeclaration.md) and [`xeStylesheet`](xeStylesheet.md).

The concrete instruction class uses the fixed diagnostic `Name` `PI`. Its `Value` is the raw payload after `<?` and before `?>`, including the processing-instruction target and any associated data. Do not assume that `Name` contains the target.

Raw traversal can expose this node, while element-only accessors exclude it. The broad script wrapper permits `Value` assignment without enforcing processing-instruction lexical rules. In particular, a payload containing `?>` can terminate the instruction early and produce malformed or unintended XML. Validate any dynamically supplied payload before serialization.

NativeXML stores the instruction; it does not execute it. The node is borrowed from the document and becomes invalid after clear, reload or destruction.

**External references**

- [W3C XML processing instructions](https://www.w3.org/TR/xml/#sec-pi)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
