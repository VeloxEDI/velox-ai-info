---
title: xeError
description: Identifies NativeXML's unknown or error sentinel, not a persistent node kind that a successful parse exposes to Velox scripts.
sidebar_position: 203
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, error, sentinel]
---

```Delphi
xeError = 17
```

### Example

```Delphi
function IsErrorKind(Kind: TsdElementType): Boolean;
begin
  Result := Kind = xeError;
end;
```

### Usage

`xeError` identifies Velox XML's unknown or error sentinel, not a persistent node kind that a successful parse exposes to Velox scripts.

### Additional Technical Info
`xeError` is NativeXML's fallback classification for an unknown or illegal opening construct. It has no mapped node class and is not a recoverable error node inserted into an otherwise successful document tree.

When text parsing cannot classify a construct, parsing reports an error rather than returning a script-visible node whose `ElementType` is `xeError`. The binary reader rejects ordinals greater than [`xeEndTag`](xeEndTag.md), so ordinal 17 is also rejected rather than instantiated. A valid borrowed `TXMLNode` should therefore never report this value.

Use document load/read error handling to detect malformed input; do not scan a parsed tree for `xeError`. The example only compares the enum value and does not demonstrate a constructible node.

**External references**

- [W3C XML 1.0](https://www.w3.org/TR/xml/)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
