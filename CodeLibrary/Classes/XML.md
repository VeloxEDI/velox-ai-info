---
title: XML
description: Source-backed guidance for NativeXML document ownership, parsing, serialization, node inspection and constrained tree mutation.
sidebar_position: 12
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, xml, nativexml, parsing, serialization]
---

The XML branch exposes two layers of Velox's vendored NativeXML model:

- [`TNativeXML`](XML/TNativeXML.md) owns a complete document, its node graph, shared UTF-8 symbol table, parser state and serialization settings.
- [`TXMLNode`](XML/TXMLNode.md) is the borrowed polymorphic view used for elements, attributes, text, comments, CDATA, declarations and other node kinds.

This is a compact DOM-like API, not Delphi's `IXMLDocument`. The scripting surface does not expose XPath, schema validation, namespace-aware lookup, parser quotas or most NativeXML formatting/encoding controls.

## Recommended lifecycle

1. Create a document in `try..finally`, normally with `TNativeXML.Create(nil)`.
2. For a new document, name the initial Root before saving. Use `NodeNew`/`NodeNewText` for detached elements and attach each exactly once with a same-document container's `NodeAdd`.
3. For input, apply upstream byte/depth/complexity limits, then load. Assume all old node references are invalid even when parsing fails.
4. Navigate through short-lived borrowed references. Use ElementType before assuming a returned TXMLNode is an ordinary element.
5. Serialize to an explicitly prepared stream when exact bytes matter. Size/truncate/reset the destination according to its concrete stream contract.
6. Free only the document and any never-attached factory node still owned by the script; never separately free attached/borrowed nodes.

## Parsing and encoding

Loading is destructive and nontransactional: the document clears before parsing and can retain an empty or partial tree on error. Normal XML is read from the current source cursor in 256-byte chunks. NativeXML binary detection instead rewinds the source to absolute zero and fully buffers it. The source must remain live and provide the size/seek behavior required by the selected path.

Names and values cross PascalScript as `UTF8String = AnsiString`. Preserve UTF-8 bytes for non-ASCII data. A successful load remembers input encoding/code-page state, while save regenerates fixed BOM behavior. Calling New/Clear after non-UTF-8 input can produce a fresh declaration saying UTF-8 while retained writer state emits another encoding; the restricted scripting surface cannot reconcile it.

`WriteToString` is unsupported in the current importer because its compile-time UTF8String/AnsiString declaration is bound directly to a native UnicodeString return and the native path itself reinterprets encoded bytes. Use `SaveToStream` for reliable byte output.

## Node lookup and mutation

Whole-document and node search can return non-element kinds. `NodeByName` searches immediate raw children; `FindNode` recursively searches descendants; both compare names case-insensitively even though XML names are case-sensitive. `ElementCount`/`Elements` provide an immediate ordinary-element-only view.

`FullPath` is raw slash concatenation, not XPath. It has no escaping, sibling indexes or namespace resolution. Duplicate names can share a path.

`NodeAdd` appends and sets Parent without validating document identity, prior ownership, duplicate attachment or cycles. Misuse can create double frees, foreign symbol-table references or unbounded recursion. Attach only a detached factory node from the same document, exactly once.

Element Value aggregates immediate text/whitespace/CDATA. Setting Value can insert/remove a text node, rejects mixed/multiple text representations and has different trailing-whitespace behavior on first insertion versus later update. `SourcePos` always returns zero in the current build because NativeXML's compile-time collection symbol is disabled.

## Security and concurrency

The reviewed normal parser has no external file/network entity resolver, but it accepts DTD structures and exposes no size, node-count or depth quota. Treat untrusted XML as a resource-exhaustion boundary. Validate business structure separately; the API does not enforce schemas, legal names, namespaces or a single-root invariant during mutation.

Documents and nodes are mutable and unsynchronized. Do not share a document between concurrent flows, mutate while traversing/serializing, or retain node references across Clear, New, Load or document destruction.

## External references

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream vendor lineage for the shipped implementation.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) and [XML Information Set](https://www.w3.org/TR/xml-infoset/) - XML structure and information-item model.
- [OWASP XML Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) - untrusted XML controls and resource-risk guidance.

<small>Created 2026-07-15</small>
