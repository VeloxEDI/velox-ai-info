---
title: "Procedure header for 'XXX' does not match."
description: "The exact Velox event procedure names, result shapes, parameter counts, modes and base types checked at compilation."
sidebar_position: 34
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - events
  - procedure-signatures
---

Velox reports `Procedure header for '<EventName>' does not match.` when a procedure uses one of eight reserved event names but its compiled signature does not satisfy the host contract. `XXX` in this catalogue title is replaced by the recognised event name.

## Example

This procedure has a value parameter instead of a `var` parameter:

```Delphi
procedure ScriptEvent(Value: Variant); // Error: header does not match
begin
  Value := 'complete';
end;
```

Use the exact event contract:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'complete';
end;
```

## Verified event signatures

| Reserved procedure | Required signature shape |
|---|---|
| `OnMapEvent` | Procedure; one `var Variant` parameter |
| `BeforeMapEvent` | Procedure; one `var Variant` parameter |
| `AfterMapEvent` | Procedure; one `var Variant` parameter |
| `AfterDetailMapEvent` | Procedure; one `var Variant` parameter |
| `ScriptEvent` | Procedure; one `var Variant` parameter |
| `LinkedDataEvent` | Procedure; one `var` class parameter; use `TdaQueryDataView` as documented for the host contract |
| `OnStartMapEvent` | Procedure; no parameters |
| `OnEndMapEvent` | Procedure; no parameters |

Parameter identifiers can differ from `Value` or `LinkedData`; their names are not part of the compiled signature.

## How Velox verifies it

After PascalScript has compiled an internal procedure, Velox's event verifier compares:

- the presence or absence of a function result;
- the exact number of parameters;
- each parameter's compiler mode (`var` is the in/out mode); and
- each parameter's PascalScript base type.

The verifier emits an `ecCustomError` containing the specific reserved event name. Other user-defined procedure names are not subject to these event checks.

## LinkedData verifier quirk

The current `LinkedDataEvent` check compares only the PascalScript base type `class`, not the exact registered class identity. A different class-typed `var` parameter can therefore pass this compiler check but still be incompatible with the delegate and host value Velox actually uses. Declare the documented `TdaQueryDataView` parameter; do not rely on the broader verifier.

## Correction procedure

1. Read the complete message to identify the reserved event name.
2. Compare procedure versus function, parameter count, `var` mode and type with the table above.
3. Remove a return type from an event procedure.
4. Preserve the correct event name; renaming it avoids the verifier only by preventing Velox from finding the event.
5. Recompile and resolve any ordinary type or declaration errors first if they obscure the header.

## Related reference

- `ScriptEvent` - general event value contract.
- `LinkedData` - required linked-data class and ownership contract.
- `OnStartMap` and `OnEndMap` - no-parameter sequence events.
- `Forward Parameter Mismatch` - a script implementation differs from its own forward declaration.

## External references

- [Free Pascal: Parameter lists](https://www.freepascal.org/docs-html/ref/refse95.html)
- [Embarcadero DocWiki: Parameters (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Parameters_%28Delphi%29)
