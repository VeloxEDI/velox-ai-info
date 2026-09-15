---
title: "RandomInt"
description: "Returns a biased rounded pseudo-random Integer between the two supplied bounds, including both endpoints."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - random
  - bias
---

```Delphi
function RandomInt(aMin, aMax: Integer): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RandomInt(1, 6); // an inclusive but biased pseudo-random value 1..6
end;
```

### Usage

`RandomInt` returns a biased rounded pseudo-random Integer between the two supplied bounds, including both endpoints.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aMin` | `Integer` | First inclusive bound and final offset. |
| `aMax` | `Integer` | Second inclusive bound. It can be less than `aMin`, although the names imply otherwise. |

**Returns**

For normal non-overflowing bounds and the default rounding mode, the result lies between the two values inclusive regardless of their order.

**Selection guidance**

If uniform discrete sampling matters, use a generator designed for integer ranges rather than rounded floating scaling. [`RandomizeSeed`](RandomizeSeed.md) can reproduce a sequence in a controlled single-caller path, but it does not isolate that sequence from other process-wide random calls.

### Additional Technical Info
`RandomInt` scales Delphi's shared floating `Random` value across the difference between two Integers, rounds that value, and adds the first bound. Under the default nearest/even rounding mode it can return both endpoints.

It is not a uniform discrete-range generator: the two endpoints receive approximately half the probability of each interior integer. Do not use it for fair dice, unbiased sampling, cryptography or identifiers. The example is fictional and source-reviewed only.

**Distribution**

For ascending bounds with span `N`, scaled values lie in `[0,N)`. Nearest rounding maps an interval of width about `0.5` to each endpoint and width about `1` to each interior integer. For `RandomInt(1,6)`, values 1 and 6 are therefore each roughly half as likely as 2, 3, 4 or 5.

The active floating-point rounding mode affects the exact buckets and midpoint behavior. Default Delphi nearest/even treatment is not forced by the wrapper.

**Implementation and state**

1. `uPSI_vxCommonNumber` registers the native function directly.
2. `(aMax - aMin)` is calculated first as a 32-bit Integer expression.
3. The span is multiplied by the next global `System.Random` Extended value.
4. Delphi `System.Round` produces an `Int64` offset.
5. Adding `aMin` and assigning the function's Integer result completes the call.

The call advances the same global `RandSeed` used by every [`Random`](Random.md) caller in the process.

**Edge cases and errors**

- Equal bounds always return that value but still call and advance `System.Random` because the multiplication expression is evaluated.
- Reversed bounds generally produce values across the reversed interval; they are not rejected or normalized.
- The 32-bit subtraction can overflow/wrap because arithmetic overflow checking is not enabled in the custom unit. A wide interval such as `Low(Integer)` to `High(Integer)` does not produce its mathematical span and can yield a completely incorrect range.
- Product range checking remains enabled in this custom unit; a final out-of-range Integer assignment can raise `ERangeError`.
- Shared generator races and calls elsewhere make sequences coupled and non-repeatable in concurrent processing.

**External references**

- [Embarcadero DocWiki: `System.Random`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Random)
- [Embarcadero DocWiki: `System.Round`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Round)
- [Free Pascal: `System.Random`](https://www.freepascal.org/docs-html/rtl/system/random.html)
- [Free Pascal: `System.Round`](https://www.freepascal.org/docs-html/rtl/system/round.html)

<small>Created 2026-07-15</small>
