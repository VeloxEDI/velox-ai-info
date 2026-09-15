---
title: TsdElementType
description: Identifies every raw NativeXML node kind including elements, text, declarations, DTD constructs, end tags and errors.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, xml, nativexml, node, element]
---

```Delphi
TsdElementType = (xeElement, xeAttribute, xeCharData, xeComment, xeCData, xeCondSection, xeDeclaration, xeStylesheet, xeDocType, xeDtdElement, xeDtdAttList, xeDtdEntity, xeDtdNotation, xeInstruction, xeWhiteSpace, xeQuotedText, xeEndTag, xeError)
```

### Example

```Delphi
procedure DescribeNode(Node: TXMLNode; var Value: Variant);
begin
  case Node.ElementType of
    xeElement: Value := 'element';
    xeAttribute: Value := 'attribute';
    xeCharData, xeWhiteSpace, xeCData: Value := 'text-like';
  else
    Value := Node.ElementTypeName;
  end;
end;
```

### Usage

`TsdElementType` identifies every raw Velox XML node kind including elements, text, declarations, DTD constructs, end tags and errors.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`xeElement`](../../Constants/Enumeration/xeElement.md) | 0 | Normal XML element with name, attributes and possible children/value. |
| [`xeAttribute`](../../Constants/Enumeration/xeAttribute.md) | 1 | Attribute node. |
| [`xeCharData`](../../Constants/Enumeration/xeCharData.md) | 2 | Character-data node. |
| [`xeComment`](../../Constants/Enumeration/xeComment.md) | 3 | XML comment. |
| [`xeCData`](../../Constants/Enumeration/xeCData.md) | 4 | CDATA section. |
| [`xeCondSection`](../../Constants/Enumeration/xeCondSection.md) | 5 | Intended DTD conditional section; not reliably observable in Velox. |
| [`xeDeclaration`](../../Constants/Enumeration/xeDeclaration.md) | 6 | XML declaration. |
| [`xeStylesheet`](../../Constants/Enumeration/xeStylesheet.md) | 7 | `xml-stylesheet` processing instruction. |
| [`xeDocType`](../../Constants/Enumeration/xeDocType.md) | 8 | DOCTYPE declaration. |
| [`xeDtdElement`](../../Constants/Enumeration/xeDtdElement.md) | 9 | DTD ELEMENT declaration. |
| [`xeDtdAttList`](../../Constants/Enumeration/xeDtdAttList.md) | 10 | DTD ATTLIST declaration. |
| [`xeDtdEntity`](../../Constants/Enumeration/xeDtdEntity.md) | 11 | DTD ENTITY declaration. |
| [`xeDtdNotation`](../../Constants/Enumeration/xeDtdNotation.md) | 12 | DTD NOTATION declaration. |
| [`xeInstruction`](../../Constants/Enumeration/xeInstruction.md) | 13 | General processing instruction. |
| [`xeWhiteSpace`](../../Constants/Enumeration/xeWhiteSpace.md) | 14 | Character data containing only whitespace. |
| [`xeQuotedText`](../../Constants/Enumeration/xeQuotedText.md) | 15 | Quoted text token used by the parser/DTD model. |
| [`xeEndTag`](../../Constants/Enumeration/xeEndTag.md) | 16 | Transient text/binary parser end-tag signal; no persistent node class. |
| [`xeError`](../../Constants/Enumeration/xeError.md) | 17 | Unknown/error sentinel; no persistent node class. |

#### Behavior and boundaries

- [`NodeNew`](../../Classes/XML/TNativeXML/Methods/NodeNew.md) and [`NodeNewText`](../../Classes/XML/TNativeXML/Methods/NodeNewText.md) create `xeElement` only. Other kinds normally originate in parsed input.
- `ElementCount` and `Elements[...]` count/filter immediate `xeElement` children only. Raw siblings, document searches and node lookup can expose attributes, comments, text, declarations, instructions and DTD nodes. Test `ElementType` before assuming element semantics.
- `xeEndTag` and `xeError` have no node-class mapping. They are control/error sentinels, not successful script-visible tree nodes.
- `xeCondSection` is not reliable: text parsing does not recognise DTD `INCLUDE` or `IGNORE` sections, and conditional sections restored from binary XML are reported as `xeComment`. Binary round trips therefore lose that distinction.
- Velox exposes neither Velox XML's whitespace-preservation nor drop-comments parser setting. Vendor defaults compact whitespace but retain comments, so formatting whitespace is normally absent while comments can remain in raw traversal.
- Reading an element `Value` concatenates only immediate `xeCharData`, `xeWhiteSpace` and `xeCData` children. It is not recursive item text. Assigning `Value` rejects mixed/multiple text shapes rather than flattening them.
- the function exposes `Name` and `Value` setters broadly, but individual node serializers do not uniformly validate forbidden sequences. For example `]]>` inside CDATA, `--` inside a comment, or `?>` inside an instruction can produce malformed or prematurely terminated XML.
- `Name`, `Value`, `IsEmpty` and `IsClear` depend on the node kind. `ElementTypeName` is a diagnostic label, not a standards-stable round-trip identifier.
- All returned nodes are borrowed from their owning document. Do not retain one across document clear, reload or destruction.
- DTD and conditional-section members show that untrusted XML can create more than the visible element tree. Apply input size, depth, external-resource and trust controls outside this lightweight parser model.

### Additional Technical Info
`TsdElementType` is NativeXML's complete raw node-kind enumeration. `TXMLNode.ElementType` returns it for any borrowed node in a document tree.

The name `ElementType` is historical: most members are not XML elements. Element-only accessors filter to `xeElement`, while raw child and traversal APIs can expose many of the listed concrete kinds. The sentinel and defective cases are detailed below.

**Related Code Library entries**

- [TXMLNode.ElementType](../../Classes/XML/TXMLNode/Methods/ElementType.md) - raw node-kind accessor.
- [TXMLNode.ElementTypeName](../../Classes/XML/TXMLNode/Methods/ElementTypeName.md) - diagnostic name mapping.
- [TXMLNode.Elements](../../Classes/XML/TXMLNode/Properties/Elements.md) - element-only filtered access.
- [TXMLNode.NextSibling](../../Classes/XML/TXMLNode/Methods/NextSibling.md) - raw sibling navigation.

**External references**

- [W3C XML 1.0](https://www.w3.org/TR/xml/) - standard XML constructs represented by these node kinds.
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream NativeXML source distribution represented by the vendored implementation.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
