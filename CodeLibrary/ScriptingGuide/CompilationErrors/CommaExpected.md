---
title: "Comma (',') expected"
description: "Where Velox requires a comma between call arguments, label names or host attribute values."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - comma
  - arguments
---

Velox reports this error when a supported comma-separated list contains another item but the parser cannot find the `,` that must separate it from the preceding item. The current compiler emits this diagnostic for routine or indexed-property arguments, label declaration names and host-registered attribute arguments.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Copy('ABCDE' 2, 3); // Error: Comma (',') expected
end;
```

Separate each argument:

```Delphi
Value := Copy('ABCDE', 2, 3);
```

Label declarations use a comma between names:

```Delphi
procedure ScriptEvent(var Value: Variant);
label
  StartLabel EndLabel; // Error: Comma (',') expected
begin
StartLabel:
  Value := 'start';
EndLabel:
  Value := 'end';
end;
```

Separate the names and define both declared labels:

```Delphi
procedure ScriptEvent(var Value: Variant);
label
  StartLabel, EndLabel;
begin
StartLabel:
  Value := 'start';
EndLabel:
  Value := 'end';
end;
```

Ordinary variable declarations can also contain comma-separated names, but their parser commonly reports `Colon (':') expected` rather than this diagnostic when the comma is omitted.

## How Velox detects it

The modified PascalScript compiler has three `ecCommaExpected` emission families:

- actual routine-call or indexed-property arguments parsed by `ReadParameters`;
- multiple names in a `label` declaration; and
- values in an attribute argument list, if the host has registered that attribute type.

The current Velox host does not register attribute types, so the third family is not normally reachable in standard scripts. Formal parameter declarations, ordinary variable-name groups and array/set syntax use other parser checks and may report a different expected token.

The reported row and column identify the token found instead of the comma. If the preceding expression is malformed, that token may be well after the actual mistake. For example, an unclosed nested call can make a valid comma belong to the wrong nesting level.

## Correction procedure

1. Identify whether the location belongs to a call/property argument list or a `label` declaration.
2. Check that the preceding item is complete, including its nested parentheses or brackets.
3. Insert a comma between peer items at the same nesting level.
4. Do not use a comma where a formal parameter group requires a semicolon, or where a declaration requires a colon.
5. Recompile after fixing the earliest list error.

## Common causes

- Omitting a separator between function arguments.
- Using whitespace as a separator between label names.
- Confusing the comma between call arguments with the semicolon used between formal parameter groups.
- Missing a closing parenthesis or bracket in the previous item.
- Leaving an incomplete expression before the next list value.

## Related reference

- `Closing parenthesis expected` — balancing a call or expression before interpreting its commas.
- `Colon (':') expected` — the likely diagnostic for a malformed ordinary declaration name list.
- `Semicolon (';') expected` — statement and formal parameter-group separation.

## External references

- [Embarcadero DocWiki: Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Procedures_and_Functions_%28Delphi%29)
