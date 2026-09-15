---
title: "CommaSeperate"
description: "Appends one value to a mutable display string using a literal comma and space after the first value."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - comma-separated
  - mutation
---

```Delphi
Procedure CommaSeperate(var Result: string; const aValue: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Summary: string;
begin
  Summary := '';
  CommaSeperate(Summary, 'Red');
  CommaSeperate(Summary, 'Blue');
  Value := Summary; // Red, Blue
end;
```

### Usage

`CommaSeperate` appends one value to a mutable display string using a literal comma and space after the first value.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `Result` | `var`/in-out | Existing list text to replace in place. It must be an assignable string variable. |
| `aValue` | input | Text appended as one unescaped value. |

There is no return value.

### Additional Technical Info
`CommaSeperate` appends `aValue` to the mutable `Result` string. If `Result` is empty, it becomes `aValue`. Otherwise the procedure replaces it with its previous value, followed by the literal characters comma-space (`, `), followed by `aValue`.

The public function name is misspelled as `Seperate`; scripts must retain that exact spelling. The example is fictional and source-reviewed only.

**Blank-value behaviour**

- If both `Result` and `aValue` are empty, `Result` remains empty. A later non-empty call is still treated as the first value.
- If `Result` is non-empty and `aValue` is empty, the procedure still appends `', '`, leaving a trailing separator.
- If `Result` contains only spaces, it is non-empty and receives a separator.

**Not a CSV encoder**

The implementation calls Velox formatting with `'%s, %s'`. It does not quote or escape commas, quotation marks, CR/LF or any other character inside `aValue`. The output is suitable for a human-readable summary only when values are already safe for that presentation. Do not use it to generate CSV or another machine-readable delimited format; use that format's serializer.

Each call recreates the accumulated string. Building a very large list one value at a time therefore copies progressively more text and can have quadratic aggregate allocation/copy cost.

<small>Created 2026-07-15</small>
