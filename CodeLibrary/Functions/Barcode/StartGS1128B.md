---
title: "StartGS1128B"
description: "Returns ReportBuilder's Code 128 start-set B character followed by its FNC1 character."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - barcode
  - code-128
  - reportbuilder
---

```Delphi
Function StartGS1128B : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := StartGS1128B + 'Batch-a123';
end;
```

### Usage

`StartGS1128B` returns ReportBuilder's Code 128 start-set B character followed by its FNC1 character.

**Returns**

A two-character string: `Char(209)` followed by `Char(207)`. In the current Velox Unicode string representation these are U+00D1 (`Ñ`) and U+00CF (`Ï`). ReportBuilder treats them as start B and FNC1 controls rather than payload characters.

**Behaviour**

Set B supports digits, upper- and lower-case letters and punctuation, but not the ASCII control-character range represented by set A. This helper supplies no payload validation, set switching, stop pattern, symbol check character or report configuration.

**Errors**

A runtime string-allocation failure can propagate.

### Additional Technical Info
`StartGS1128B` returns the two-character prefix that ReportBuilder uses to begin manually encoded Code 128 set B data and mark the symbol as GS1 data with FNC1.

**Implementation**

Velox registers the parameterless function directly. Its terminal implementation constructs and concatenates the two Delphi `Char` values. The ordinals match the constants used by the shipped ReportBuilder manual Code 128 implementation.

**Edge cases and quirks**

- The returned characters are ReportBuilder input controls, not raw Code 128 codeword numbers and not a portable GS1 interchange format.
- Delphi's current `Char` is 16-bit, whereas Free Pascal's documented `Char` is 8-bit. Although ordinals `209` and `207` exist in both, conversions through an incompatible code page or normalisation layer can change the string before ReportBuilder sees it.
- With ReportBuilder automatic encoding enabled, the explicit start control can be removed and a set selected again from the payload. The helper alone does not force set B.
- No FNC1 separator is inserted after variable-length data, and no check is made that application-identifier content is valid in set B.
- The historical identifier contains `GS1128`; the current standards name is GS1-128.

**Side effects**

The function returns a new managed string only and does not access a report, printer or scanner.

**Performance and concurrency**

Work and result length are constant. The function has no shared state and is re-entrant.

**Related entries**

- [`StartGS1128A`](StartGS1128A.md) starts set A, including its control-character repertoire.
- [`StartGS1128C`](StartGS1128C.md) starts the dense numeric-pair set C.
- [`AddGS1128`](AddGS1128.md) joins already validated application-identifier text and values.

**External references**

- [ReportBuilder: Manual Encode 128](https://rbwiki.digital-metaphors.com/rcl/barcode/manual-encode-128/)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [Free Pascal: `Char`](https://www.freepascal.org/docs-html/rtl/system/char.html)
- [Embarcadero DocWiki: `System.Char`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Char)

<small>Created 2026-07-15</small>
