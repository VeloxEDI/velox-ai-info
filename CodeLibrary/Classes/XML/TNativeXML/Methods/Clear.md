---
title: Clear
description: Destroys the complete XML tree and rebuilds declaration, doctype and root nodes from persistent document flags.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, clear, reset, ownership, invalidation]
---

```Delphi
procedure Clear;
```

### Example

```Delphi
procedure ReuseDocument(Xml: TNativeXML);
begin
  if Xml = nil then Exit;

  Xml.Clear;
  Xml.Root.Name := 'NewMessage';
end;
```

### Usage

`Clear` destroys the complete XML tree and rebuilds declaration, doctype and root nodes from persistent document flags.

### Additional Technical Info
`Clear` destroys all current root nodes and their owned descendants, clears the shared symbol table, then reconstructs the document from persistent internal flags for declaration, doctype and root presence.

For a document made with the exposed [`Create`](Create.md), those flags initially mean no declaration, no doctype and one unnamed root. After [`New`](New.md), the declaration flag remains true, so later Clear calls recreate a default `<?xml version="1.0" encoding="utf-8"?>` declaration plus the unnamed root.

Every previously returned [`Root`](../Properties/Root.md), traversal result, element lookup and child reference becomes invalid. Do not read or free those stale objects. Unattached nodes created by NodeNew are not in an owned list and are not reliably reclaimed by Clear; attach or explicitly free them before resetting.

Clear is not a full settings reset. It does not call NativeXML's `ResetDefaults`, and it does not reset remembered external encoding, code page, BOM, formatting or other document options. This creates a significant reuse boundary: after loading non-UTF-8 XML, Clear can rebuild a declaration containing `encoding="utf-8"` while later SaveToStream still emits the previously remembered encoding.

The operation allocates replacement nodes after destructive clearing and is not transactional. An allocation or setter exception can leave no complete root. It performs no file or stream I/O.

[`IsEmpty`](IsEmpty.md) normally returns true after a successful Clear because the reconstructed root has no name, value, attributes or children, even when a declaration exists outside the root.

The example is source-reviewed only; no tree was cleared.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - upstream document reset implementation lineage.
- [W3C XML document structure](https://www.w3.org/TR/xml/#sec-documents) - prolog and document-element model.

<small>Created 2026-07-15</small>
