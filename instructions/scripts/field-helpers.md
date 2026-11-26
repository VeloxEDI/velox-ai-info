---
title: Concise field checks with native helpers
description: Prefer documented TvxField predicates when their semantics match, while preserving exact tests and output values.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-19T21:20:24Z"
---

# Concise field checks with native helpers

Applies to generated, edited or reviewed Velox scripts that read `TvxField` values, including Map events. Read [shared rules](../common.md), [script failure handling](failure-handling.md) and the [owning event's Value contract](event-value-context.md). Map examples also follow [procedure-header context comments](../maps/field-authoring.md#procedure-header-context-comments).

## Authoring convention

Prefer documented `TvxField.IsNullEmpty` and `NotNullEmpty` over repeated `AsString`, `Trim` and separate NULL checks **when their documented semantics match the business requirement**. Aim for concise, readable code with less repetition and easier maintenance. No measured runtime improvement is claimed; the helper itself still performs the documented conversion/trim check.

- `IsNullEmpty` covers a NULL field, an empty string and whitespace-only converted text. `NotNullEmpty` is its logical inverse.
- In the existing references, the whitespace rule uses ordinary Delphi Trim: leading/trailing characters at or below U+0020. Do not silently broaden it to all Unicode whitespace. Concrete field formatting/conversion can affect the text being tested.
- Preserve exact-NULL tests (`IsNull`, `NotNull`) when NULL must remain distinct from an empty string, spaces or zero.
- Preserve explicit numeric/date-zero tests when zero is the actual requirement. Use `IsNullZero`/`NotNullZero` only when their full documented, type-dependent sentinel semantics match; they also have Boolean and Variant-state implications. Do not replace zero tests with nonblank-text predicates.
- Checking `NotNullEmpty` does not change the output contract. Keep `AsString` when nonblank output must be copied unchanged. Use `AsStringTrim` only when trimming the assigned value is explicitly required.
- Do not add redundant NULL/empty checks around these helpers, introduce unnecessary validation or change business behaviour merely to shorten code. If existing code distinguishes whitespace or intentionally trims output, preserve that requirement.
- Apply the predicate to the actual field object and current record in the owning context. Do not invent an equivalent helper on unrelated objects or assume every Variant/string has these methods.

## Choose the test that matches the requirement

| Requirement | Appropriate check |
| --- | --- |
| NULL, empty or whitespace-only text is absent | `Field.IsNullEmpty` |
| Converted text contains something after trimming | `Field.NotNullEmpty` |
| Database NULL alone is absent | `Field.IsNull` or the inverse `Field.NotNull` |
| Numeric/date zero has a specific business meaning | Preserve the explicit typed zero test; use zero helpers only when their documented wider semantics are intended |
| Nonblank output must retain surrounding spaces | Check with `NotNullEmpty`, then assign `AsString` |
| Output must be normalised by trimming | Assign `AsStringTrim` only when this transformation is part of the requirement |

Numeric zero, Boolean false and date/time zero normally format as nonempty text. An emptiness predicate therefore does not establish a nonzero/nonfalse value. Do not infer field type or output normalisation from a successful text predicate.

## Generic field OnMap example

Assume `SOURCE` is the bound source dataset and the event owns destination field `OUTPUT.ADVISER_NAME`. Replace illustrative names with the actual native bindings. The business rule here treats absent code/name as an expected blank-output case, not a script failure.

```pascal
procedure OnMapEvent(var Value: Variant);  //OUTPUT.ADVISER_NAME
begin
  Value := '';

  if SOURCE['AdviserCode'].IsNullEmpty then
    Exit;

  if SOURCE['AdviserName'].NotNullEmpty then
    Value := SOURCE['AdviserName'].AsString;
end;
```

If the code is absent, the event leaves blank output. If the code is present but the name is NULL, empty or whitespace-only, output also remains blank. If both checks pass and the name is `'  Example Name  '`, the assigned nonblank string retains its surrounding spaces. Changing the assignment to `AsStringTrim` would change that output and is not implied by this convention.

Do not turn a normal blank-result branch into an error or create new validation requirements. Where the actual business rule requires processing to fail, use `LogError` and explicit stop/propagation according to the failure-handling standard instead. Do not add an otherwise empty field handler merely to use a helper.

## Review and validation

1. Confirm whether absence means exact NULL, trimmed-empty text, a numeric/date sentinel or another condition.
2. Compare the chosen helper with its documented semantics, including conversions and whitespace boundaries.
3. Preserve the assigned value, event binding/header context, failure behaviour and meaningful existing checks.
4. Review NULL, empty, spaces-only, nonblank text with surrounding spaces and relevant zero-value cases. Do not describe a static review as actual execution.
5. Report static validation, native compilation and runtime tests separately. Readability and maintenance benefits do not establish measured performance gains.

## Sources and verification scope

The convention and intended mapping behaviour were supplied by the user. Helper semantics were checked against the existing local [IsNullEmpty](../../CodeLibrary/Classes/Data/TvxField/Methods/IsNullEmpty.md), [NotNullEmpty](../../CodeLibrary/Classes/Data/TvxField/Methods/NotNullEmpty.md), [IsNull](../../CodeLibrary/Classes/Common/TField/Properties/IsNull.md), [NotNull](../../CodeLibrary/Classes/Data/TvxField/Methods/NotNull.md), [IsNullZero](../../CodeLibrary/Classes/Data/TvxField/Methods/IsNullZero.md), [NotNullZero](../../CodeLibrary/Classes/Data/TvxField/Methods/NotNullZero.md) and [AsStringTrim](../../CodeLibrary/Classes/Data/TvxField/Properties/AsStringTrim.md) Code Library references. In particular, the emptiness helpers test text and do not write a trimmed value back to the field.

This is a documentation-based semantic check, not independent product-source verification. No native Velox compilation/runtime test or performance measurement was performed for this update. No customer configuration was modified; this standard remains `review-required`.
