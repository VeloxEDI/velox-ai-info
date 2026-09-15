---
title: "Barcode"
description: "Functions for constructing ReportBuilder-compatible GS1-128 control strings and calculating decimal check digits."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - barcode
  - gs1-128
  - reportbuilder
---

The Barcode group contains legacy helpers for building GS1-128 data strings for the ReportBuilder barcode component and for calculating decimal GS1-style check digits. The helpers operate on strings and numbers only: they do not configure a report, draw bars, verify scanner output or certify that supplied data conforms to the GS1 standard.

The identifiers retain the historical `GS1128` and `EAN128` spelling used by Velox. The current standards terminology is GS1-128.

## Common tasks

- Use `CheckSum` to calculate the standard right-to-left alternating-weight check digit for a digit string that excludes its check digit.
- Use `AddGS1128` to concatenate an application identifier and its value when the caller has already validated their format and separation requirements.
- Use `StartGS1128A`, `StartGS1128B` or `StartGS1128C` only when constructing ReportBuilder's manual Code 128 input convention.
- Treat `EAN13toEAN128` as a legacy specialised conversion and review its documented input truncation and date-addition behaviour before using it.

## Important behaviour

The start helpers return ReportBuilder control characters followed by its FNC1 character. These are not the Code 128 symbol's numeric codewords, printable human-readable text or a portable interchange format. Preserve the string as character data until it reaches a compatible ReportBuilder barcode component.

ReportBuilder normally uses automatic Code 128 encoding. Its shipped automatic encoder removes explicit start and switch controls before selecting sets again, while retaining FNC1. Consequently, an explicit start helper does not by itself force set A, B or C. A manually encoded report must be configured for manual encoding; the Velox functions do not change that report property.

## Edge cases and quirks

- `AddGS1128` performs plain concatenation. It does not add parentheses, FNC1 separators, padding or a check digit and does not validate the application identifier.
- `CheckSum` and `CheckDigit` are different implementations. `CheckSum` returns `0` for a zero remainder, whereas `CheckDigit` returns `10`; do not treat them as interchangeable.
- The start-set functions do not check whether later characters are valid for the selected set. In particular, manually encoded set C data must be organised as numeric pairs, apart from supported control characters.
- `EAN13toEAN128` hard-codes application identifiers `02` and `17`, takes only the first 12 characters after trimming the barcode, and adds its two `TDateTime` values numerically before formatting one date.
- Successful string construction does not prove GS1 conformance. Validate application-identifier rules, field lengths, permitted characters, required separators, report settings, printed quality and scanner behaviour in the owning solution.

## External references

- [GS1 Application Identifiers](https://ref.gs1.org/ai/?lang=en)
- [GS1 General Specifications, release 26.0](https://ref.gs1.org/standards/genspecs/26.0.0/)
- [ReportBuilder: Manual Encode 128](https://rbwiki.digital-metaphors.com/rcl/barcode/manual-encode-128/)
