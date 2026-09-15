---
title: IsClear
description: Tests whether a node has no child nodes, no virtual value and an empty virtual name.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, clear, empty, name]
---

```Delphi
function IsClear: Boolean;
```

### Example

```Delphi
procedure InitializeRoot(Xml: TNativeXML);
begin
  if (Xml.Root <> nil) and Xml.Root.IsClear then
    Xml.Root.Name := 'Document';
end;
```

### Usage

`IsClear` tests whether a node has no child nodes, no value and an empty name.

### Additional Technical Info
`IsClear` returns `IsEmpty and (Length(Name) = 0)`. It is a structural/native-state test, not a test for serialized XML validity.

[`IsEmpty`](IsEmpty.md) requires a zero all-node child count and an empty virtual [`Value`](../Properties/Value.md). IsClear additionally requires an empty virtual [`Name`](../Properties/Name.md). The unnamed root created by `TNativeXML.Create(nil)` is therefore clear until it receives a name, value, attribute or child node.

Node-kind polymorphism matters. Character-data and comment nodes expose fixed nonempty kind names such as `Text` or `Comment`, so they are not clear even when their Value is empty. An empty named element can be empty without being clear. An attribute's internally owned quoted-value object is not exposed through its base child count, so an empty-name/empty-value attribute can report clear even though that is not useful XML.

Whitespace, comments, attributes and every other retained child kind make a container nonempty because the underlying count is not element-only. The method does not trim Name or Value and does not recurse into descendants.

The call has no side effect. Use it for the freshly created unnamed-root state, not as a substitute for schema, well-formedness or business-content validation.

The example is source-reviewed only; no root was initialized.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - exact `IsClear` implementation.
- [W3C XML document element](https://www.w3.org/TR/xml/#sec-documents) - document-element naming and structure requirements.

<small>Created 2026-07-15</small>
