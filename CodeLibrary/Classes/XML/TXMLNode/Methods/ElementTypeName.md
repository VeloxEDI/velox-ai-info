---
title: ElementTypeName
description: Returns NativeXML's fixed English display name for the concrete node's TsdElementType value.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, element-type, display-name, diagnostics]
---

```Delphi
function ElementTypeName: UTF8String;
```

### Example

```Delphi
procedure ReadNodeKind(Node: TXMLNode);
var
  KindName: UTF8String;
begin
  if Node = nil then Exit;
  KindName := Node.ElementTypeName;
end;
```

### Usage

`ElementTypeName` returns Velox XML's fixed English display name for the node's TsdElementType value.

### Additional Technical Info
`ElementTypeName` calls [`ElementType`](ElementType.md) virtually, then indexes NativeXML's fixed name table. It is useful for diagnostics and explanatory output.

The exact ordinal mapping is: `Element`, `Attribute`, `Text`, `Comment`, `CData`, `ConditionalSection`, `Declaration`, `Stylesheet`, `DocType`, `DtdElement`, `DtdAttList`, `DtdEntity`, `DtdNotation`, `Instruction`, `WhiteSpace`, `QuotedText`, `EndTag`, and `Error`.

The result is an implementation label, not an XML tag name. For example, a character-data node reports `Text`; an ordinary element reports `Element`, regardless of its [`Name`](../Properties/Name.md). The labels are not localized and their casing is fixed by the vendored table.

Use the enumeration from ElementType for branches and persisted logic. Treat ElementTypeName as display text because it is coupled to the vendor's table and does not carry namespace, path or schema information.

The returned `UTF8String` is exposed as PascalScript `AnsiString`. Every current label is ASCII, so no code-page ambiguity arises for these values.

The method has no side effects or allocation ownership for the caller. A stale node reference remains unsafe.

The example is source-reviewed only; no node was inspected at runtime.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - fixed element-type name table.
- [W3C XML Information Set](https://www.w3.org/TR/xml-infoset/) - standard XML information-item terminology for comparison.

<small>Created 2026-07-15</small>
