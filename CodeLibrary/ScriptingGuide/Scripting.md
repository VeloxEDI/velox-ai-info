---
title: Scripting
description: Structure, compilation and execution context of a Velox Pascal script.
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - pascal
  - compilation
---

Velox scripts use an embedded PascalScript compiler configured by Velox. The compiler supplies Object Pascal syntax, while Velox registers the functions, variables, types, classes and required event procedures that a particular script can use.

## Basic structure

Most script editors create a required event procedure. A general script uses:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Trim(VarToStr(Value));
end;
```

Map event editors use event-specific names such as `BeforeMapEvent`, `AfterMapEvent`, `LinkedDataEvent`, `OnStartMapEvent`, `AfterDetailMapEvent` and `OnEndMapEvent`. Keep the generated procedure name, parameter order, type and `var` mode unchanged.

## How compilation works

For each scripter instance, Velox performs the following sequence:

1. Copies the editor text into the PascalScript component. An empty formula is not compiled.
2. Runs the PascalScript preprocessor. Includes can resolve the map's Global Script, a configured scriptlet or a file from the Velox Scripts folder.
3. Registers the standard PascalScript surface and Velox imports for the current source, destination, action and map context.
4. Compiles the expanded source and collects compiler messages.
5. Verifies recognised event procedures. For example, `ScriptEvent` must have one `var Variant` parameter; the no-parameter map events must have no parameters.
6. Binds runtime instances for the variables and classes used by the compiled script.
7. Retrieves the compiled event delegate and stores it on the owning map/script item. The owner marks that event compiled until its formula or owning item is reset; the reusable scripter's general compiled flag is cleared after delegate retrieval.

The engine enables source that omits a conventional program `begin`/`end`, permits unit syntax and uses short-circuit Boolean evaluation. These options make event procedures convenient, but they do not expose every feature of a current Delphi compiler.

## Execution context

Registered names depend on the host. A map script can receive source/destination modules, current data views, fields, flags and map state that do not exist in a transport or standalone formula. `Dest` falls back to the source module when no separate destination has been assigned, which lets destination-oriented helpers compile in a source-only context but does not create a second module.

The script is executed in the thread running the Velox action. Calls that perform I/O, database work or shared-state changes are therefore synchronous unless their individual documentation says otherwise. An unhandled script exception is caught at the surrounding Velox event boundary and logged with context; later processing depends on that boundary and the log status.

## Common mistakes

- Renaming an event procedure or changing `var` to a value parameter causes the custom “procedure header ... does not match” compiler error.
- Assuming all Delphi routines are present causes an unknown-identifier error. Only registered entries in this Code Library are available.
- Treating a context object as always assigned can cause a nil-object runtime error in a host that does not provide it.
- Relying on implicit Variant conversion can turn `Null`, unassigned or incompatible data into a runtime conversion error. Test uncertain values first.
- Editing an included scriptlet can affect every script that includes it; review its callers before changing shared declarations.

## Edge cases and quirks

- PascalScript is Delphi-like, not the Delphi compiler. Newer language constructs and unregistered overloads can be absent.
- Event delegates are cached by the owning map/script item, with a separate compiled flag for each event. Formula setters clear the applicable owner flag so the next execution recompiles; the underlying scripter does not retain its general compiled flag after returning a delegate.
- Compiler hints from included files are filtered from the editor output when their module name is not the main script, while errors still prevent successful compilation.
- The include callback deliberately returns success even when it supplies empty text. A missing include can consequently surface as missing declarations or behaviour rather than the preprocessor's normal “include not found” error.

## Related reference

- **Events** — exact event procedure contracts.
- **Includes** — scriptlet and file resolution.
- **Compilation errors** — interpreting compiler output.
- **Functions** — reading registered routine declarations.

## External references

- [Free Pascal Reference guide](https://www.freepascal.org/docs-html/ref/ref.html) — general Object Pascal compatibility context; Velox support is determined by its PascalScript compiler.
- [Embarcadero Delphi Language Reference](https://docwiki.embarcadero.com/RADStudio/Athens/en/Delphi_Language_Reference) — Delphi language context, not proof that a construct is registered in Velox.
