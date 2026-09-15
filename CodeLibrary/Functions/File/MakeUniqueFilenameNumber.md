---
title: "MakeUniqueFilenameNumber"
description: "Returns the original file name when absent or the first currently unused numeric-suffixed alternative starting at 2."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - filename
  - unique
  - numbering
---

```Delphi
Function MakeUniqueFilenameNumber( const aFilename : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MakeUniqueFilenameNumber('C:\Fictional\order.csv');
  // If order.csv exists and order2.csv does not, returns order2.csv.
end;
```

### Usage

`MakeUniqueFilenameNumber` returns the original file name when absent or the first currently unused numeric-suffixed alternative starting at 2.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilename` | `string`, `const` | Preferred path/name. Relative paths are queried from the process current directory. |

**Returns**

The original string when currently absent; otherwise `<path><base>2<extension>`, `<path><base>3<extension>`, and so on until a currently absent candidate is found. No separator is inserted before the number.

**Behaviour**

- Existing `order.csv` first proposes `order2.csv`, not `order1.csv` or `order_2.csv`.
- If `order2.csv` and `order3.csv` exist, the next proposal is `order4.csv`.
- An absent preferred path is returned exactly.
- Only the final extension is preserved separately.

**Errors**

File-existence checks can be affected by access restrictions and files being created or removed concurrently. String allocation, counter overflow and other unexpected errors are raised to the script.

**Usage notes**

Use when human-readable sequential alternatives are preferred and collision races are handled by the later file-creation operation. Use GUID suffixes when avoiding long sequential scans matters.

### Additional Technical Info
`MakeUniqueFilenameNumber` returns `aFilename` unchanged when it does not currently identify a file. When it exists, the function tests numeric suffixes beginning at 2 and returns the first candidate for which [`FileExists`](FileExists.md) is false.

The example uses a fictional path and was not executed by the documentation workflow. The returned path is not created or reserved.

**Implementation**

After an initial `FileExists`, the Velox implementation splits the path/name/final extension. It removes the extension from the base, sets an `Integer` counter to 2, builds `lPath + lFilename + IntToStr(i) + lExt`, increments the counter, and repeats while the candidate exists.

**Edge cases and quirks**

- The result is not atomically reserved. Concurrent callers can receive the same candidate.
- Existing digits are not parsed: existing `order9.csv` first proposes `order92.csv`.
- A dotfile `.env` has an empty base and first proposes `2.env`.
- A directory at the preferred path makes `FileExists` false, so the unchanged directory path is returned.
- Dense existing numeric sequences cause many synchronous metadata queries, especially expensive on remote storage.
- In the theoretical case of exhausting `Integer`, current checked arithmetic can raise rather than return a name.
- No sanitisation, path-length validation or permission/access proof is performed.

**Side effects**

No persistent change. It performs one or more file-system existence queries.

**Performance and concurrency**

Cost is linear in the number of occupied candidates, with one file-system query per candidate. There is no locking or atomic create, so it is unsafe as a concurrency allocator.

**Related entries**

- [`MakeUniqueFilename`](MakeUniqueFilename.md) uses a GUID suffix after one occupied preferred name.
- [`AppendIdFilename`](AppendIdFilename.md) always inserts a GUID without checking storage.
- [`FileExists`](FileExists.md) defines the query semantics and race boundary.

**External references**

- [Embarcadero `System.SysUtils.FileExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileExists)
- [Free Pascal `FileExists`](https://www.freepascal.org/docs-html/rtl/sysutils/fileexists.html) - compatible query context; the starting value and concatenation sequence are Velox-owned.

<small>Created 2026-07-15</small>
