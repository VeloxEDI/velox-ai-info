---
title: xeCondSection
description: Names NativeXML's intended DTD conditional-section kind, which the text parser does not recognise and its class does not report correctly.
sidebar_position: 194
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, xml, nativexml, dtd, conditional-section]
---

```Delphi
xeCondSection = 5
```

### Example

```Delphi
function IsConditionalSectionKind(Kind: TsdElementType): Boolean;
begin
  Result := Kind = xeCondSection;
end;
```

### Usage

`xeCondSection` names Velox XML's intended DTD conditional-section kind, which the text parser does not recognise and its class does not report correctly.

### Additional Technical Info
`xeCondSection` is intended to represent a DTD `INCLUDE` or `IGNORE` conditional section. In this NativeXML 4.07 implementation it is effectively a broken/reserved enum value rather than a reliably observable text-document node kind.

**Exact implementation defects**

- `ReadOpenTag` recognises `<![CDATA[` but has no branch for `<![INCLUDE[` or `<![IGNORE[`. Text parsing reports an illegal/unsupported construct instead of creating this type.
- The mapped `TsdConditionalSection` class inherits `TsdComment` and does not override `ElementType`. An instance of that class therefore returns [`xeComment`](xeComment.md).
- Binary reading can create `TsdConditionalSection` when ordinal 5 is present, but the object immediately reports Comment. A later binary save writes the reported comment ordinal, so the conditional-section identity collapses.
- Script factories expose only normal element creation; they cannot construct a conditional-section node directly.

Do not write production logic that expects `Node.ElementType = xeCondSection` for ordinary XML input. Treat the value as evidence of the vendor model's intended vocabulary, not evidence that the feature works. If DTD conditional sections matter, reject them before this parser or use a parser with tested DTD support.

The example compares an enum value only. It does not imply that a normal Velox parse will return the value.

**External references**

- [W3C XML conditional sections](https://www.w3.org/TR/xml/#sec-condition-sect)
- [SimDesign NativeXML source archive](https://sourceforge.net/projects/simdesign/files/trunk/nativexml/)

<small>Created 2026-07-15</small>
