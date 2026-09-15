---
title: "Unknown Property"
description: "What the host-registration Unknown Property exception means when a nominated default member is absent."
sidebar_position: 46
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - properties
  - registration
  - default-property
---

`Unknown Property : '<name>'` is raised while a script-visible class is being registered with the compiler. It means an import nominated a default indexed property, but no registered item with that name exists on the compile-time class.

## Message shape

```text
Unknown Property : '<registered member name>'
```

The short catalogue title omits the member parameter. Preserve the complete message because the name identifies the failing import registration.

## How it is produced

Velox registers script-visible classes and their members before compiling the user's statements. An import can then call PascalScript's `SetDefaultPropery` operation (the misspelling is part of the shipped API). The operation normalises the requested name, searches the class item list from newest to oldest and then follows one of four outcomes:

- an indexed property is found: it becomes the default property;
- a non-property member with the name is found: `Not a property` is raised;
- a property with no index parameter is found: `Not an array property` is raised;
- no matching item is found: `Unknown Property` is raised.

Current shipped imports nominate default members including `Strings`, `Variable`, `VariableByCode`, `Map`, `FieldName`, `Fields`, `Items` and `Values`. The list is implementation context, not a guarantee that every one is available on every class or in every event.

## What to do

1. Retain the complete message, Velox version, compile action, event/module context and script.
2. Confirm whether every script using the same module or class family fails before ordinary statement analysis.
3. Record any customised or newly deployed scripting import.
4. Report the issue through the normal Velox support process as an import/class-registration mismatch.
5. Do not create a script property or add punctuation to work around the registration fault.

## Edge cases and quirks

- This is not the `Unknown identifier` diagnostic used for an ordinary missing member in script source.
- The lookup is case-insensitive because registered names are normalised before comparison.
- The class-item list is searched from the most recently registered item backwards. A later same-name registration can affect which of the three failure branches is selected.
- The exception can occur before the compiler analyses the statement that caused a class/import to be loaded.
- No runnable failing script is provided because user source cannot repair or safely construct a missing host registration.

## Related reference

- `Not a property` - a same-named registered item exists but is not a property.
- `Not an array property` - the property exists but has no index parameters.
- `Unknown identifier` - an ordinary script name or member cannot be resolved.
- `Write-only property` - the property is registered but exposes no getter.

## External references

- [Free Pascal: Property definition](https://www.freepascal.org/docs-html/ref/refsu33.html)
- [Embarcadero DocWiki: Properties (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Properties_%28Delphi%29)

These links explain the language concept of properties and default/indexed access. The `SetDefaultPropery` lookup and exception are specific to the embedded PascalScript host registration.
