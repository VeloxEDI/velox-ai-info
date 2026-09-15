---
title: "Exclude"
description: "Removes one byte-encoded member from a mutable PascalScript set by clearing its ordinal bit."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sets
  - exclude
  - enumeration
  - mutation
  - implementation-defect
---

```Delphi
procedure Exclude;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Options: TLocateOptions;
begin
  Options := [loCaseInsensitive, loPartialKey];
  Exclude(Options, loPartialKey);

  Value := not (loPartialKey in Options); // True
end;
```

### Usage

`Exclude` removes one byte-encoded member from a mutable Velox scripting set by clearing its ordinal bit.

**Effective call syntax**

```Delphi
Exclude(var S, Member);
```

**Parameters**

| Name | Effective mode | Description |
|---|---|---|
| `S` | `var`/in-out | Set variable to mutate. It must be an assignable variable, not a set literal, property result or expression. |
| `Member` | input | Member whose ordinal bit is cleared. For safe use, its type must be exactly the base enumeration or Byte type of `S`, and its value must be in that set's declared range. |

There is no return value. Test membership with `Member in S` after the call if later logic needs to observe the state.

### Additional Technical Info
`Exclude` mutates an existing PascalScript set variable by clearing the bit for one enumeration or Byte member. If the member is already absent, the set remains unchanged. The function does not allocate or return a new set.

The generated Code Library declaration is incomplete: the modified PascalScript compiler creates the parameterless declaration first and then programmatically injects two required, untyped parameters. Real scripts must use the two-argument form shown in the example. The example is fictional and source-reviewed only.

**Generated declaration**

**Implementation**

At compile time, `S` is injected as an untyped `pmInOut` parameter and `Member` as an untyped `pmIn` parameter. The compiler enforces only that `S` is a variable; because neither injected parameter declares a type, it does not prove that `S` is a set or that `Member` belongs to the set's base type.

At runtime, the modified PascalScript `Exclude_` handler:

1. requires the first value's runtime base type to be `btSet`;
2. requires the member's runtime base type to be `btU8`;
3. reads the member as an unsigned byte ordinal;
4. selects byte `Ordinal shr 3`; and
5. clears bit `Ordinal and 7` using bitwise AND-NOT.

Small enumerations are exported to the runtime as `btU8`, so ordinary enum-set use such as `TLocateOptions` works. A `set of Byte` also meets the terminal types.

**Idempotence and state**

Clearing an already-clear bit is harmless and produces the same set. The procedure changes only the supplied variable's bit storage. It does not log, change a dataset, set flow status or affect another set value that was copied before the call.

The mutation is not synchronised. Do not arrange for concurrent script executions to mutate the same externally shared set storage without an ownership/locking design. Ordinary local variables and per-object properties owned by one execution do not introduce that sharing by themselves.

**Character-set incompatibility**

PascalScript permits set types whose base is `Char`, and Velox exposes `TvxChars` and `TvxSeparators`. However, a character argument retains runtime type `btChar`, while `Exclude_` accepts only `btU8`. Consequently, the natural call below can compile but fails when the external runtime handler is called:

```Delphi
// Do not use: the current runtime rejects the btChar member.
Exclude(Separators, ',');
```

For a character set, use a same-typed set expression instead:

```Delphi
Separators := Separators - [','];
```

This is a current modified-PascalScript implementation defect, not Delphi `System.Exclude` behaviour.

**Critical range and type hazard**

The runtime verifies the broad storage classes but never verifies that the byte member belongs to this particular set or is below the set's bit size. Enumeration sets often occupy fewer than 32 bytes. Passing a `Byte` or a member of an unrelated small enum can therefore compile and pass the runtime `btU8` test.

If that ordinal exceeds the set's last bit, `Exclude_` indexes beyond the allocated set storage and writes there without a range check. This can corrupt adjacent PascalScript stack data rather than producing a clean “member out of range” error. Never use integer casts, arbitrary bytes, unrelated enumerations or unvalidated ordinals as `Member`; use a value of the exact base type of `S`.

For wrong broad runtime types—such as a non-set first argument or `Char` member—the handler returns `False` and PascalScript reports that it could not call the procedure. There is no special Velox recovery or diagnostic added around it.

**Related entries**

- [`Include`](Include.md) sets the corresponding membership bit and has the same compiler/runtime limitations.

**External references**

- [Embarcadero DocWiki: `System.Exclude`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Exclude)
- [Free Pascal: `System.Exclude`](https://www.freepascal.org/docs-html/rtl/system/exclude.html)

<small>Created 2026-07-15</small>
