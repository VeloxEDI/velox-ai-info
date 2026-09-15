---
title: "GetIssueForPartyType"
description: "Returns the Velox party-not-found issue number for a party type."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - party
  - issue
  - validation
---

```Delphi
Function GetIssueForPartyType(const aPartyType : integer) : integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetIssueForPartyType(2); // 1015: Supplier Not Found
end;
```

### Usage

`GetIssueForPartyType` returns the Velox party-not-found issue number for a party type.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aPartyType` | `integer`, `const` | Velox party type number. |
| Result | `integer` | Corresponding party-specific issue number, or generic issue `1029` for every unrecognized party type. |

**Complete mapping**

| Party type | Party meaning | Issue | Issue meaning |
|---:|---|---:|---|
| `1` | Customer | `1014` | Customer Not Found |
| `2` | Supplier | `1015` | Supplier Not Found |
| `3` | Consignor | `1016` | Consignor Not Found |
| `4` | Consignee | `1017` | Consignee Not Found |
| `5` | Location | `1018` | Location Not Found |
| `6` | Carrier | `1019` | Carrier Not Found |
| `7` | Shipper | `1034` | Shipper Not Found |
| `8` | Agent | `1035` | Agent Not Found |
| `100` | Company | `1020` | Company Not Found |
| any other integer | Unknown/custom party type | `1029` | Party Not Found |

**Behaviour and edge cases**

- Unknown values, `0`, negative values and future/custom party type numbers all return `1029`; they do not return `Null` and do not raise an exception.
- Company is deliberately numbered `100`, outside the contiguous `1`–`8` party range.
- The function does not check whether a party is actually missing. The caller is responsible for performing the lookup and invoking the appropriate issue-handling flow.
- The mapping is compiled into the product and is not changed by editing issue text, party configuration or database records.
- A returned number identifies the standard issue definition, but the exact displayed wording and handling can depend on the issue-processing context.

### Additional Technical Info
`GetIssueForPartyType` selects the standard Velox “not found” issue number for a party type. It gives the caller a consistent issue definition to use when customer, supplier, location or other party resolution fails.

**Implementation**

The function uses a fixed `case` statement over the party type constants. Each recognized type returns the corresponding integer literal shown in the table; the `else` branch returns literal `1029`. Every integer therefore produces a result.

No party record is loaded and no issue is raised, logged or created by this function. It only returns an issue number for the caller to use.

**Implementation quirk**

The Delphi function and PascalScript declaration return `integer`, and the implementation returns integer literals. By contrast, the separately exposed `I1014`, `I1015` and other issue constants are Delphi strings containing digit text and are registered with the scripting compiler as `String`. Direct calls to this function therefore have a numeric result, while named issue constants such as `I1015` have a text result. Code passing either form to another API must follow that API's declared parameter and conversion rules.

**Side effects, errors and performance**

The function is pure and constant-time. It performs no I/O, changes no state and has no ordinary error path for an integer argument.

**Related entries**

- Use the result with the issue-creation or issue-reporting API appropriate to the current map and execution context.
- Party type and issue constants expose the same numbers as named Code Library entries; the function centralizes the correct relationship between them.

<small>Created 2026-07-15</small>
