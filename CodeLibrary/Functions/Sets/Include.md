---
title: "Include"
description: "Adds one byte-encoded member to a mutable PascalScript set by setting its ordinal bit."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sets
  - include
  - enumeration
  - mutation
  - implementation-defect
---

```Delphi
procedure Include;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Options: TLocateOptions;
begin
  Options := [];
  Include(Options, loCaseInsensitive);

  Value := loCaseInsensitive in Options; // True
end;
```

### Usage

`Include` adds one byte-encoded member to a mutable Velox scripting set by setting its ordinal bit.

**Effective call syntax**

```Delphi
Include(var S, Member);
```

**Parameters**

| Name | Effective mode | Description |
|---|---|---|
| `S` | `var`/in-out | Set variable to mutate. It must be an assignable variable, not a literal or calculated set expression. |
| `Member` | input | Member whose ordinal bit is set. For safe use, its type must be exactly the base enumeration or Byte type of `S`, and its value must be in that set's declared range. |

There is no return value. Use `Member in S` when later script logic needs a Boolean membership result.

**Critical range and type hazard**

The runtime does not compare the member ordinal with the supplied set's actual bit size or base type. Because the injected member is untyped, a `Byte` or unrelated small-enum value can compile and still satisfy the broad `btU8` test.

Passing a number that is outside the set's valid member range can corrupt script state instead of raising a reliable error. Always pass a named member of the set's exact type, and never construct the value from unvalidated numeric data or a cast.

When either broad value type check fails, the handler returns `False` and Velox scripting reports that it could not call the procedure. Velox adds no function validation or recovery.

### Additional Technical Info
`Include` mutates an existing PascalScript set variable by setting the bit for one enumeration or Byte member. If the member is already present, the set remains unchanged. The function does not allocate or return a new set.

The generated Code Library declaration is incomplete: the modified PascalScript compiler creates the parameterless declaration first and then programmatically injects two required, untyped parameters. Real scripts must use the two-argument form shown in the example. The example is fictional and source-reviewed only.

**Generated declaration**

**Implementation**

At compile time, `S` is injected as an untyped `pmInOut` parameter and `Member` as an untyped `pmIn` parameter. The first mode makes the compiler require a variable. The missing parameter types mean ordinary validation does not prove that the variable is a set or that the member belongs to its base type.

At runtime, the modified PascalScript `Include_` handler:

1. requires the first value's runtime base type to be `btSet`;
2. requires the member's runtime base type to be `btU8`;
3. reads the member as an unsigned byte ordinal;
4. selects byte `Ordinal shr 3`; and
5. sets bit `Ordinal and 7` using bitwise OR.

Enumeration types with a highest ordinal at or below 255 are exported as `btU8`; runtime set loading itself rejects sets larger than 256 bits. This supports normal small enum sets and `set of Byte`, subject to the critical same-type/range rule below.

**Idempotence and state**

Setting an already-set bit is harmless and produces the same set. `Include` changes only the supplied variable's set storage. It does not return whether the member was new, log the change or alter Velox flow status.

Local variables are normally owned by one script execution. If a set property or other storage can be shared between concurrent executions, this read-modify-write bit operation has no lock and must be protected by the owning design.

**Character-set incompatibility**

The PascalScript type system permits `set of Char`, and Velox exposes the `TvxChars` and `TvxSeparators` types. A character member is nevertheless represented as runtime `btChar`, not the `btU8` required by `Include_`. The intuitive call below can compile but is rejected when the external handler runs:

```Delphi
// Do not use: the current runtime rejects the btChar member.
Include(Separators, ',');
```

Use a set expression, which follows a separate compiler path, for character sets:

```Delphi
Separators := Separators + [','];
```

Delphi's intrinsic `System.Include` accepts a member compatible with the set's base type; the character rejection is specific to the modified PascalScript terminal used by Velox.

**Related entries**

- [`Exclude`](Exclude.md) clears the membership bit and has the same compiler/runtime limitations.

**External references**

- [Embarcadero DocWiki: `System.Include`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Include)
- [Free Pascal: `System.Include`](https://www.freepascal.org/docs-html/rtl/system/include.html)

<small>Created 2026-07-15</small>
