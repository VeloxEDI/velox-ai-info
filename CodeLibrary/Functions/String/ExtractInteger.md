---
title: "ExtractInteger"
description: "Concatenates every ASCII digit found anywhere in a string without parsing a sign, separator or numeric value."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - integer
  - digits
  - extraction
---

```Delphi
Function ExtractInteger(const S: string): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractInteger('Order AB-12 / line 034'); // '12034'
end;
```

### Usage

`ExtractInteger` concatenates every ASCII digit found anywhere in a string without parsing a sign, separator or numeric value.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `string` | Text to scan. |
| Result | `String` | All ASCII digits in their original order, or `''` when none exist. |

### Additional Technical Info
`ExtractInteger` copies every ASCII digit (`'0'` through `'9'`) from `S` into one result string. All other characters are discarded. It extracts characters; it does not parse or return an integer value.

The example is fictional and source-reviewed only.

**Consequences of character collection**

- Separate numeric groups are joined: `'12-34'` becomes `'1234'`.
- A minus or plus sign is discarded: `'-42'` becomes `'42'`.
- Decimal/group separators are discarded: `'1,234.50'` becomes `'123450'`.
- Leading zeroes are retained.
- Non-ASCII decimal digits are discarded.
- No integer range or overflow check occurs because no conversion is performed.

Use it when the requirement is explicitly “retain all ASCII digits.” It is unsafe as a general numeric parser because it can silently change meaning. If exactly one integer token is required, validate the expected syntax and then use an integer conversion routine.

The Velox terminal preallocates a result as long as the input, fills accepted characters in one pass, then shortens it to the accepted count. Runtime is linear and there are no external side effects.

**Related entries**

- [`ExtractNumberString`](ExtractNumberString.md) also retains one dot and an optional first retained sign.

<small>Created 2026-07-15</small>
