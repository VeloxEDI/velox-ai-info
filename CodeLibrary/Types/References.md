---
title: References
description: "Understand the alternate type names exposed by Velox and the runtime, ownership, range, and validation rules inherited from their target types."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, types, references, aliases, ownership, validation]
---

## Available reference types

| Reference | Exact target | Main use |
|---|---|---|
| [`Dataset`](References/Dataset.md) | `TvxClientDataSet` | Short name for a Velox client-dataset object reference. |
| [`DateTime`](References/DateTime.md) | `TDateTime` | Short name for Delphi's Double-backed date/time value. |
| [`DWORD`](References/DWORD.md) | `LongWord` | Windows-style unsigned 32-bit value. |
| [`Stream`](References/Stream.md) | `TMemoryStream` | Short name for a resizable memory-stream object reference. |
| [`StringList`](References/StringList.md) | `TStringList` | Short name for a mutable string-list object reference. |
| [`TFileName`](References/TFileName.md) | `String` | Semantic name for text intended to represent a file path or name. |
| [`TSoundexIntLength`](References/TSoundexIntLength.md) | `LongInt` | Length argument for the packed-Integer Soundex family. |
| [`TSoundexLength`](References/TSoundexLength.md) | `LongInt` | Length argument for string Soundex generation and comparison. |

## What a reference means

These entries are type aliases, not reference-counted values and not the same feature as Delphi procedural or anonymous-method references. Four convenience names are created with the modified PascalScript compiler's type-copy operation; the remaining four are parsed from an ordinary target declaration. Both mechanisms resolve to an existing runtime type.

Consequently, declaring or assigning an alias performs no conversion and adds no policy:

- scalar aliases keep the target's bit representation, arithmetic, precision and managed-value behavior;
- class aliases hold the same object pointer, so assignment does not clone the object;
- methods and properties are those of the target class, including members documented at a visible or hidden ancestor path;
- object ownership is decided by the producer, not by the spelling of the variable's type;
- semantic names such as `TFileName` do not validate the value; and
- native Delphi subranges can disappear when an importer registers the alias as unrestricted script `Integer`.

Aliases and their exact targets can normally be used interchangeably in assignments and parameters. Prefer the public target type when its documentation makes the contract clearer, and use an alias when it matches an exposed declaration or improves the script's intent.

## Ownership and mutation

`Dataset`, `Stream` and `StringList` are class references. Two variables can therefore point to the same mutable object. Navigation through one dataset alias changes the cursor seen through another; stream reads and writes share Position and bytes; list edits change the same collection. Assigning one variable to another never gives an independent copy.

Host-provided datasets remain host-owned. A script-created `TMemoryStream` or `TStringList` remains script-owned and must normally be released with `Free` in `finally`. A function can return a borrowed or transferred object, so read that function or property page before deciding who frees it.

## Boundary guidance

- Validate Soundex lengths before the call because the script aliases do not retain Delphi's nominal subranges.
- Keep `DWORD` unsigned across Variant, signed database and JSON boundaries, especially above `2,147,483,647`.
- Carry timezone and format metadata separately from `DateTime`; the numeric value itself has neither.
- Treat `TFileName` as untrusted text until the specific operation has applied an allowed-root, traversal, existence and access policy.
- Snapshot dataset scalar values before any call that can navigate or rebuild the cursor.
- Bound memory-stream and string-list growth from partner-controlled input.

No runtime, dataset, filesystem, stream, Soundex or image function was executed while documenting this branch.

**External references**

- [Embarcadero type compatibility and identity](https://docwiki.embarcadero.com/RADStudio/Athens/en/Type_Compatibility_and_Identity_%28Delphi%29) - Delphi alias/identity context; the exact Velox registrations are described on each child page.
- [Free Pascal types](https://www.freepascal.org/docs-html/ref/refch3.html) - compatible Pascal type-system context.

<small>Created 2026-07-15</small>
