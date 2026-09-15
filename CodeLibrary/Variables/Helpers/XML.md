---
title: "XML"
description: "Returns the lazily created scripter-owned NativeXML document workspace."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - xml
---

```Delphi
function XML: TNativeXML;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  XML.Clear;
  XML.New;
  XML.NodeNewText('Status', 'Example');
  Value := XML.WriteToString;
end;
```

### Usage

`XML` provides a reusable XML document for the current script execution. It starts empty on first use. Load or read operations populate the tree; node creation, deletion and editing change that same tree; save or write operations serialise it.

Changes remain available to later scripts in the same execution. Reading `XML` does not automatically load map input, choose an encoding, validate a schema or write a file. Clear or reload the document before using it for unrelated XML.

### Additional Technical Info
`XML` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TNativeXML` |
| Ownership | Scripter-owned |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Failures, safety and implementation cautions**

Clear or create a known document before reuse. Treat external XML as untrusted, constrain document size/depth and disable or avoid unsafe external-entity/resource resolution according to parser capability. Define encoding/namespaces explicitly, validate required nodes and never free or retain nodes after the scripter.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TNativeXML`](../../Classes/XML/TNativeXML.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [W3C: Extensible Markup Language (XML) 1.0](https://www.w3.org/TR/xml/) defines XML syntax; the Velox class page defines the exposed parser API.

<small>Created 2026-07-15</small>
