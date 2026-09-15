---
title: "StartGS1128C"
description: "Returns ReportBuilder's Code 128 start-set C character followed by its FNC1 character."
sidebar_position: 7
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
Function StartGS1128C : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := StartGS1128C + AddGS1128('01', '09412345543219');
end;
```

### Usage

`StartGS1128C` returns ReportBuilder's Code 128 start-set C character followed by its FNC1 character.

**Returns**

A two-character string: `Char(210)` followed by `Char(207)`. In the current Velox Unicode string representation these are U+00D2 (`Ò`) and U+00CF (`Ï`). ReportBuilder interprets them as start C and FNC1 controls.

**Behaviour**

The example appends application identifier `01` and a 14-digit value, giving an even number of payload digits for set C. The helper itself does not count digits, validate their content or insert later controls. ReportBuilder calculates the Code 128 symbol-level check character when it renders compatible data.

**Errors**

No data error is raised by this function because it receives no payload. Allocation failures can propagate through normal runtime behaviour; incompatible payload is detected, if at all, later by the renderer or scanner.

### Additional Technical Info
`StartGS1128C` returns the two-character prefix that ReportBuilder uses to begin manually encoded Code 128 set C data and mark the symbol as GS1 data with FNC1. Set C encodes decimal digits in pairs and is the dense numeric set commonly used for GS1-128 data.

**Implementation**

Velox registers the parameterless function directly. Its terminal implementation constructs and concatenates those two Delphi `Char` values. The ordinals are the start-C and FNC1 constants in the shipped ReportBuilder manual Code 128 implementation.

**Edge cases and quirks**

- Manually encoded set C consumes decimal digits as pairs. An odd number of digits or a non-digit in a set-C segment is invalid unless an appropriate supported control changes the active set; this helper does not detect that condition.
- The returned values are ReportBuilder's private character convention, not the Code 128 numeric start-C and FNC1 codewords.
- Current Delphi `Char` is a 16-bit Unicode character and Free Pascal documents an 8-bit `Char`. Preserve U+00D2 and U+00CF without lossy code-page conversion when moving the result to ReportBuilder.
- ReportBuilder automatic encoding removes explicit starts before choosing sets from the data. Use the receiving component's manual-encoding configuration when the explicit start-C choice must be preserved.
- The initial FNC1 identifies GS1 data, but this function does not add FNC1 separators required after applicable variable-length element strings.
- The historical identifier contains `GS1128`; the current standards name is GS1-128.

**Side effects**

The function creates string data only. It does not alter the receiving report's `AutoEncode` setting or perform rendering or I/O.

**Performance and concurrency**

The function performs constant work and has no shared state. It is re-entrant.

**Related entries**

- [`StartGS1128A`](StartGS1128A.md) starts set A.
- [`StartGS1128B`](StartGS1128B.md) starts set B.
- [`EAN13toEAN128`](EAN13toEAN128.md) hard-codes the same start-C and FNC1 prefix.

**External references**

- [ReportBuilder: Manual Encode 128](https://rbwiki.digital-metaphors.com/rcl/barcode/manual-encode-128/)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [Free Pascal: `Char`](https://www.freepascal.org/docs-html/rtl/system/char.html)
- [Embarcadero DocWiki: `System.Char`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Char)

<small>Created 2026-07-15</small>
