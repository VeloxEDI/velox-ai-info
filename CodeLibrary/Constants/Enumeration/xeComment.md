---
title: xeComment
description: Identifies a NativeXML comment node preserved by Velox defaults and written without validating XML comment delimiters.
sidebar_position: 193
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, comment, node]
---

```Delphi
xeComment = 3
```

### Example

```Delphi
function IsCommentNode(Node: TXMLNode): Boolean;
begin
  Result := (Node <> nil) and (Node.ElementType = xeComment);
end;
```

### Usage

`xeComment` identifies a Velox XML comment node preserved by Velox defaults and written without validating XML comment delimiters.

**Mutation and output risk**

The broad node function permits `Value` assignment. Velox XML surrounds the value with `<!--` and `-->` when saving but does not reject an embedded `--` sequence or a comment body ending in `-`. Such values violate XML comment grammar and can produce malformed output.

Do not place secrets or operational instructions in comments on the assumption that element-oriented code will remove them. Raw traversal and saved output retain them by default.

**Conditional-section defect**

Conditional sections restored from binary XML are reported as `xeComment`, not [`xeCondSection`](xeCondSection.md). A comment result can therefore represent that known Velox defect, although normal text parsing does not create conditional sections.

Borrowed comment references remain owned by the document and become invalid after clear, reload or destruction.

### Additional Technical Info
`xeComment` identifies an XML `<!-- ... -->` node. Comments can occur in the document root list or inside containers, are visible to raw traversal and are excluded from `ElementCount`, `Elements[...]` and an element's aggregated `Value`.

NativeXML can drop comments while parsing, but its default is to preserve them. The Velox `TNativeXML` script wrapper does not expose `DropCommentsOnParse`, so a script-created parser keeps comments unless native product code configured the underlying object before use.

**External references**

- [W3C XML comments](https://www.w3.org/TR/xml/#sec-comments)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
