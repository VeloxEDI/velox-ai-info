---
title: xeStylesheet
description: Identifies an xml-stylesheet processing instruction that NativeXML stores as declaration-like attributes without applying a stylesheet.
sidebar_position: 206
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, stylesheet, processing-instruction]
---

```Delphi
xeStylesheet = 7
```

### Example

```Delphi
function IsStylesheetInstruction(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeStylesheet);
end;
```

### Usage

`xeStylesheet` identifies an xml-stylesheet processing instruction that Velox XML stores as declaration-like attributes without applying a stylesheet.

### Additional Technical Info
`xeStylesheet` identifies an `<?xml-stylesheet ...?>` processing instruction. NativeXML gives this target a specialised declaration-like node rather than the general [`xeInstruction`](xeInstruction.md) representation.

The node has the fixed name `xml-stylesheet` and parses pseudo-attributes such as `type` and `href` into its attribute list. It preserves and serializes the instruction; it does not fetch, trust, execute or apply the referenced stylesheet. An `href` is input data and must not by itself authorize network or file access.

The node is excluded from element-only accessors but can appear in raw document traversal. Generic `Name` and `Value` access does not provide a validated stylesheet-instruction editor, and the script wrapper exposes no dedicated stylesheet API. Inspect its raw attributes carefully if integration behavior depends on them.

As with other parsed nodes, the reference is document-owned and becomes invalid after clear, reload or destruction.

**External references**

- [W3C Associating Style Sheets with XML documents](https://www.w3.org/TR/xml-stylesheet/)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
