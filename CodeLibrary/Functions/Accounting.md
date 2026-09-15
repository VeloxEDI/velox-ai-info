---
title: "Accounting"
description: "Percentage-based tax and discount calculations exposed to Velox scripts."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - tax
  - discount
  - percentages
---

The Accounting group contains small, deterministic calculations for applying tax and discount percentages. Use these functions when a mapping needs the mathematical amount or adjusted value and the surrounding configuration already defines the correct business rate and rounding rule.

These functions operate on `Extended` values. They do not look up tax codes or discount agreements, validate whether a rate is commercially valid, or round a result to a currency precision.

## Common tasks

- Use `TaxInclusive` to add a tax percentage to a tax-exclusive value.
- Use `TaxExclusive` to remove the same percentage factor from an inclusive value.
- Use `TaxAmount` when the required result is the percentage amount calculated from a supplied base.
- Use `Discounted` for the value remaining after a discount, or `DiscountAmount` for the discount component itself.

## Important behaviour

Every entry performs one arithmetic expression and returns the result unchanged. No entry accesses map, module or dataset state, and none has a built-in monetary rounding step. Apply the integration's explicit currency and decimal-place policy after the calculation when exact output precision matters.

## Edge cases and quirks

- Rates are percentages: pass `15` for 15%, not `0.15`.
- Negative rates and rates above 100% are accepted and calculated literally.
- `TaxExclusive` divides by the rate factor. A rate of `-100` makes that factor zero; the resulting exception or non-finite value follows the active floating-point environment.
- `TaxAmount` calculates a percentage of its input; it does not extract the embedded tax component from a tax-inclusive total.
- The precision and storage size of Delphi `Extended` are platform dependent. Results should not be treated as exact decimal currency values.

## External references

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)


