---
title: Name
description: Reads or attempts to set the concrete node kind's UTF-8 name, with element/attribute storage and no XML-name validation.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, name, utf8, rename]
---

```Delphi
property Name: UTF8String read write;
```

### Example

```Delphi
procedure RenameElement(Node: TXMLNode);
begin
  if (Node <> nil) and (Node.ElementType = xeElement) then
    Node.Name := 'OrderLine';
end;
```

### Usage

Reads or attempts to set the node kind's UTF-8 name, with element/attribute storage and no XML-name validation.

### Additional Technical Info
`Name` dispatches to the concrete node class. Ordinary elements and attributes store their names in the owning document's shared symbol table. Renaming one updates the node immediately and changes its [`FullPath`](FullPath.md) and every descendant FullPath.

The setter performs no XML lexical, namespace, reserved-prefix, uniqueness or document-structure validation. Empty names, whitespace and other illegal text can be stored and may later produce malformed XML. Validate names before assignment.

Not every `TXMLNode` has a freely mutable XML name:

- elements and attributes return and set their stored names;
- character-data, whitespace, comments and CDATA nodes expose kind-derived names such as `Text`, `WhiteSpace`, `Comment` and `CData`;
- character-data descendants ignore a name assignment, emitting only a native debug hint for a nonempty value; and
- base/other node implementations can raise `Cannot set name` or implement fixed/specialized semantics.

Check [`ElementType`](../Methods/ElementType.md) before writing. The broad importer marks the property read/write for every node even though the virtual native contract varies by runtime kind.

`UTF8String` is registered as PascalScript `AnsiString`. The bytes must already be UTF-8 for non-ASCII XML names. Passing system-code-page bytes can create invalid or incorrectly serialized names.

Search behavior is inconsistent by design: [`NodeByName`](../Methods/NodeByName.md) and [`FindNode`](../Methods/FindNode.md) compare names case-insensitively, while XML and [`HasAttribute`](../Methods/HasAttribute.md) are case-sensitive. Do not use those lookup methods to assert exact-case uniqueness.

The operation is unsynchronized and nontransactional. The example is source-reviewed only; no node was renamed.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - virtual name getters/setters and symbol-table storage.
- [W3C XML names](https://www.w3.org/TR/xml/#NT-Name) - legal XML Name grammar.
- [W3C XML namespaces](https://www.w3.org/TR/xml-names/) - namespace and reserved-prefix constraints not enforced here.

<small>Created 2026-07-15</small>
