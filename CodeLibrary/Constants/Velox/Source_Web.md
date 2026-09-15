---
title: Source_Web
description: Identifies the Web source-origin category as Source.Num value 3 for Velox scripts and transaction records.
sidebar_position: 451
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - source-origin
  - constant
---

```Delphi
Source_Web = 3
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetSourceCode(Source_Web); // 'Web'
end;
```

### Usage

`Source_Web` identifies the Web source-origin category as Source.Num value 3 for Velox scripts and transaction records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Paired text | [`Source_Web_String`](./Source_Web_String.md) = `Web` |
| Database domain | `Source.Num` / `Source.Description` |
| Security helper treatment | treated as a partner source by current helper logic |

### Additional Technical Info
`Source_Web` is the script-visible `LongInt` identifier for the **Web** transaction-source category. Its fixed value is `3`, paired with [`Source_Web_String`](./Source_Web_String.md).

`Source_Web` identifies provenance metadata. It does not prove how a request arrived, authenticate a caller, stamp a transaction record or authorise partner/internal processing.

**Implementation**

Velox declares and registers the fixed `LongInt` value `3`. [`GetSourceCode`](../../Functions/Velox/GetSourceCode.md) maps it to `Web`; [`GetSourceNum`](../../Functions/Velox/GetSourceNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Source_Web!>` expands to `3`.

Fresh-build VxData seeds `Source` row `3` with Description `Web`. Numerous transaction headers and operational records expose nullable `SourceNum` foreign keys to this table.

**Behaviour**

Number-to-text conversion is fixed in product code and does not query VxData. Text matching is case-insensitive but non-trimming; unsupported text or numbers and a `Null` number return `Null`.

[`IsSourceInternal`](../../Functions/Velox/IsSourceInternal.md) returns true only for value `1` (App). [`IsSourcePartner`](../../Functions/Velox/IsSourcePartner.md) returns the direct negation, so this value is partner-treated. Those helpers choose a security-treatment branch; they do not verify provenance.

**Edge cases and quirks**

- `IsSourcePartner` returns true for every integer other than 1, including unsupported values such as 0 or 99. Validate or convert source input before using that helper as a policy branch.
- `Source_API`, `Source_Web` and `Source_EDI` are all partner-treated. The category name does not imply a particular authentication strength.
- The database column is named `Description`, not `Code`, even though its seeded text is used as the canonical converter token.
- PascalScript retains no source-domain type information after an integer or string is evaluated. Values overlap many other constant families.
- The text converter accepts case differences but not leading/trailing whitespace; an empty or padded token returns `Null`.
- The tag expansion produces the number `3`, not the text `Web`.
- A source constant records a category only. It does not inspect transport headers, API credentials, files, user sessions or database provenance.

**Side effects**

Reading `Source_Web`, comparing it, expanding its tag or using the fixed converters/helpers has no I/O or state-changing effect. The caller owns any field assignment and validation.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting an unsupported source number can fail a `SourceNum` foreign key; this page's seeded value is valid in a fresh database.

**Performance and concurrency**

This is an immutable compiled value. Access and fixed-case helper/converter checks are constant-time for practical purposes and carry no shared mutable source state.

**Remarks**

The example is source-reviewed and non-destructive. It converts a fixed identifier only and does not create or classify a live transaction.

**Related entries**

- [`Source_Web_String`](./Source_Web_String.md) is the paired canonical text.
- [`GetSourceCode`](../../Functions/Velox/GetSourceCode.md) converts a supported source number to text.
- [`GetSourceNum`](../../Functions/Velox/GetSourceNum.md) converts recognised text to a source number.
- [`IsSourceInternal`](../../Functions/Velox/IsSourceInternal.md) and [`IsSourcePartner`](../../Functions/Velox/IsSourcePartner.md) apply the current internal/partner branch rule.

<small>Created 2026-07-15</small>
