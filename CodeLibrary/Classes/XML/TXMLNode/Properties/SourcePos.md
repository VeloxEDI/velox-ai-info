---
title: SourcePos
description: Returns zero in the current Velox build because NativeXML source-position capture is compile-time disabled.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, xml, node, source-position, parser, disabled]
---

```Delphi
property SourcePos: Int64 read;
```

### Example

```Delphi
procedure ReadPosition(Node: TXMLNode);
var
  Position: Int64;
begin
  if Node <> nil then
    Position := Node.SourcePos; // Current Velox result is always 0.
end;
```

### Usage

`SourcePos` returns zero in the current Velox build because Velox XML source-position capture is disabled in Velox.

### Additional Technical Info
`SourcePos` is exposed as an Int64 parser-position property, but it is not operational in the current Velox product. NativeXML conditionally stores and returns `FSourcePos` only when its `SOURCEPOS` compile symbol is defined.

In the vendored `NativeXml.pas`, the local define is commented out (`{.$define SOURCEPOS}`), and source review found no project/unit define enabling it. The compiled fallback getter therefore returns literal `0` for every node, including parsed nodes and newly created nodes.

Do not interpret zero as the start of the XML token, distinguish a first node from later nodes with it, or use it in parsing diagnostics. It contains no current file/stream offset information.

Even if a future build enables collection, the native comments describe a source position where node text begins. Exact meaning can vary by node kind and parser buffering/encoding, and it would be an input-stream byte-oriented parser position rather than a Unicode character index. Documentation must be revalidated against that future build before relying on it.

The importer and runtime property helper preserve the native Int64 without deliberate narrowing. The current limitation is compile-time data absence, not numeric width.

The property has no side effect. The example is source-reviewed only; no position was read at runtime.

**External references**

- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/) - conditional `SOURCEPOS` field and zero fallback.
- [Embarcadero conditional compilation](https://docwiki.embarcadero.com/RADStudio/en/Conditional_compilation_(Delphi)) - Delphi compile-symbol behavior governing this property.

<small>Created 2026-07-15</small>
