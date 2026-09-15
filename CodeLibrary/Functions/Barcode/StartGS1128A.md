---
title: "StartGS1128A"
description: "Returns ReportBuilder's Code 128 start-set A character followed by its FNC1 character."
sidebar_position: 5
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
Function StartGS1128A : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := StartGS1128A + 'ABC123';
end;
```

### Usage

`StartGS1128A` returns ReportBuilder's Code 128 start-set A character followed by its FNC1 character.

**Returns**

A two-character string: `Char(208)` followed by `Char(207)`. In the current Velox Unicode string representation these are U+00D0 (`Ð`) and U+00CF (`Ï`). ReportBuilder interprets them as start A and FNC1 controls rather than printable data.

**Behaviour**

Set A supports uppercase letters, digits, punctuation and the Code 128 representation of ASCII control characters. This function supplies only the start and initial FNC1 controls. It does not append payload, a stop pattern or a check character, and it does not configure a report component.

**Errors**

No application-level error is raised or caught. Normal managed-string allocation failures can propagate.

### Additional Technical Info
`StartGS1128A` returns the two-character prefix that ReportBuilder uses to begin manually encoded Code 128 set A data and mark the symbol as GS1 data with FNC1.

**Implementation**

Velox registers the parameterless function directly. Its terminal implementation constructs and concatenates the two Delphi `Char` values. The numeric assignments match the constants in the shipped ReportBuilder manual Code 128 encoder.

**Edge cases and quirks**

- The values `208` and `207` are ReportBuilder's private input convention, not the numeric Code 128 start-A and FNC1 codewords.
- Modern Delphi defines `Char` as a 16-bit `WideChar`, while the cited Free Pascal `Char` is an 8-bit type. Both can represent these ordinal values, but storage and string encoding differ. Preserve the resulting characters through any database, file or transport layer.
- ReportBuilder's automatic encoder strips explicit start and switch controls and chooses sets again. An explicit `StartGS1128A` prefix therefore requires a compatible manual-encoding report configuration to force set A.
- The function does not validate later data against set A or add FNC1 separators between variable-length GS1 elements.
- The historical identifier contains `GS1128`; the current standards name is GS1-128.

**Side effects**

The function returns allocated string data only. It does not mutate report state or perform I/O.

**Performance and concurrency**

The function performs constant work and returns a fixed-length string. It has no shared state and is re-entrant.

**Related entries**

- [`StartGS1128B`](StartGS1128B.md) starts ReportBuilder set B.
- [`StartGS1128C`](StartGS1128C.md) starts the numeric-pair set C.
- [`AddGS1128`](AddGS1128.md) concatenates an application identifier and value without adding controls.

**External references**

- [ReportBuilder: Manual Encode 128](https://rbwiki.digital-metaphors.com/rcl/barcode/manual-encode-128/)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [Free Pascal: `Char`](https://www.freepascal.org/docs-html/rtl/system/char.html)
- [Embarcadero DocWiki: `System.Char`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Char)

<small>Created 2026-07-15</small>
