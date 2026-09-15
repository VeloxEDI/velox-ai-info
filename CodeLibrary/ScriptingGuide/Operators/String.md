---
title: "String"
description: "String concatenation and comparison behaviour in Velox expressions."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - strings
---

Use `+` to concatenate compatible script strings or characters. Relational operators compare text directly; there is no separate locale-aware string operator.

## Syntax

```Delphi
Combined := LeftText + RightText;

LeftText = RightText
LeftText <> RightText
LeftText < RightText
LeftText > RightText
LeftText <= RightText
LeftText >= RightText
```

## How concatenation works

Velox carries a source modification in `TPSPascalCompiler.GetResultType`: when either operand of `+` is string-like (`string`, character, `PChar`, wide string/character or `UnicodeString`), the compiler selects `UnicodeString` as the expression result. The calculation opcode then converts/copies the operands through the PascalScript string runtime and appends the right value.

This promotes mixed ANSI/wide/Unicode text to Unicode rather than preserving a short/ANSI result based only on the first operand. It does not make every arbitrary type a supported text operand.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Prefix: string;
  Suffix: string;
begin
  Prefix := 'VEL';
  Suffix := 'OX';
  Value := Prefix + Suffix;
end;
```

The result is `VELOX`. Concatenation creates a result value; it does not modify `Prefix` or `Suffix` until an assignment stores the result.

## Comparison behaviour

The relational runtime compares strings/chars by their character values. Comparisons are:

- case-sensitive;
- whitespace-sensitive;
- not automatically trimmed;
- not locale/culture collation; and
- ordered lexically by the runtime representation rather than natural numeric ordering.

Normalise with an explicitly registered routine such as case conversion or trimming only when that matches the data contract. Do not silently normalise identifiers whose case or whitespace is significant.

## Common mistakes

- Assuming `+` converts any number, date, object or Null Variant to readable text. Use the appropriate explicit formatting/conversion function.
- Expecting case-insensitive equality.
- Comparing numeric text lexically (`'10' < '2'`) and expecting numeric ordering.
- Repeatedly concatenating in a large loop without considering allocation/copy cost.
- Treating `nil`, Null Variant and empty string as interchangeable.

## Edge cases and quirks

- **Compile/runtime acceptance can differ for mixed operands.** The Velox result-type modification selects Unicode whenever either side is string-like before fully proving that the other side can be converted. An expression such as text plus an arbitrary numeric/object value can therefore pass this result selection but fail in the runtime string conversion. Convert the non-text operand explicitly.
- Empty text concatenated with text returns the other text value, subject to result-type conversion.
- Script string indexing and indexed assignment use hidden runtime helpers and Pascal-style indexing. Invalid positions raise under those helper rules; do not use indexing without checking length.
- A comparison with a compiler-materialised string `nil` uses an empty string representation. Prefer `Text = ''` for clarity and portability.
- Variant string operations use the actual runtime subtype and can raise for Null or incompatible content. Test Null separately.
- Unicode promotion avoids the Free Pascal short-string truncation rule described by its general reference for this Velox expression path, but assignment to a narrower registered destination can still convert or lose data according to that destination.

## Errors and side effects

Static incompatibility can produce a compile-time type mismatch; deferred mixed-string or Variant conversion can fail at runtime. Concatenation/comparison does not mutate its scalar operands. Property/function operands may execute code and preserve those side effects.

## Performance and concurrency

Concatenation allocates/copies managed text. A sequence such as `S := S + Piece` in a large loop can approach quadratic copying as `S` grows. Prefer collecting/formatting through an appropriate registered helper when available. String expressions do not provide synchronisation for shared object properties.

## Related reference

- `Assignment` — stores the concatenated result.
- `Relational (Comparison)` — complete operand compatibility and Variant comparison rules.
- `Testing values` — distinguishes Null, Empty and empty text.

## External references

- [Free Pascal: String operators](https://www.freepascal.org/docs-html/current/ref/refsu47.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
