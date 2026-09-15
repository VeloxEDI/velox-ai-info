---
title: "Write-only property"
description: "Why a script cannot read a registered property that exposes only a setter."
sidebar_position: 51
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - properties
  - getter
  - setter
---

Velox reports `Write-only property` when a script reads a registered class property for which the scripting import exposes a setter but no getter. Assigning the property can be valid; using it as a value is not.

## Example

The shipped `TvxDefManager.FilePath` registration is setter-only and is reachable through the `Action.Data` manager. Reading it fails during compilation:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Action.Data.FilePath; // Error: Write-only property
end;
```

If the flow is designed to set the monitored source path, retain the value separately instead of reading the property back:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  NewPath: string;
begin
  NewPath := 'C:\Example\Inbound\sample.edi';
  Action.Data.FilePath := NewPath;
  Value := NewPath;
end;
```

Setting `Action.Data.FilePath` changes flow state and should be done only when the configuration design requires it; the example is fictional and source-reviewed, not executed against a flow.

## How Velox detects it

When the compiler resolves a property access on a registered external/script class, it knows the property declaration and the getter/setter procedure registrations:

- an assignment requests `Property_Set`; if no setter is registered, Velox emits `Read-only property`;
- a value read requests `Property_Get`; if no getter is registered, Velox emits `Write-only property`.

The current compiler has this getter check in both direct property access and chained class-member access. It occurs before call bytecode is emitted, so a missing getter is a compile-time failure rather than a runtime exception.

## Actual `FilePath` setter behaviour

The `TvxDefManager.FilePath` runtime helper delegates to the manager's setter. The setter assumes that the manager has a valid `ActionMan` reference, then checks the action's file monitor and source. When both are assigned, it casts the source to `TvxFileDef` and writes the path to that source's file connection. With a valid action manager, an absent file monitor or source causes no write and no status is returned. A missing `ActionMan` is not guarded in this setter and can fail before those conditional checks. There is deliberately no script getter registered for this property.

This behaviour explains why assigning the property and reading it back are not symmetric. Do not use a read-back attempt as confirmation that the state change occurred.

## Correction procedure

1. Decide whether the statement is intended to set the property or obtain a value.
2. For a set, use `Object.Property := Value` and observe any documented side effects/preconditions of that property.
3. For a read, use a documented readable property or retain the original value in a local variable when that accurately represents the required logic.
4. Do not add a getter-shaped routine name or cast; script code cannot create a missing host registration.
5. If the Code Library says the property should be readable, preserve the full diagnostic and report a scripting-registration discrepancy.

## Edge cases and quirks

- Property visibility is determined by the scripting import, not solely by the underlying Delphi property. An underlying getter that was not registered remains unavailable to scripts.
- A setter-only property can perform arbitrary work rather than store a readable field. Assignment success does not imply a value can be retrieved later.
- `Action.Data.FilePath` relies on Velox's normal action-manager/file-source wiring. It does not validate a missing action manager or prove that the monitored source is a file definition before casting it.
- Passing the property as an input argument, comparing it, concatenating it or assigning it to another variable all require a getter and trigger this diagnostic.
- A runtime exception raised inside an available getter is a different failure; this diagnostic means no getter was registered at compile time.
- The public message does not name the property. Use the reported position and surrounding member chain to identify it.
- `Unknown Property` is a host-registration exception for a missing nominated default member and is unrelated to reading a known setter-only property.

## Performance and concurrency

No getter executes when this diagnostic is emitted. A valid setter may mutate shared flow or module state; its concurrency and side effects depend on the specific property. The `Action.Data.FilePath` setter follows the action's current file-monitor/source references, assumes the normal host wiring is intact, and provides no locking or success result in this path.

## Related reference

- `Read-only property` - a registered property has a getter but no setter.
- `Unknown Property` - host setup nominated a default property that is absent.
- `Not a property` - host setup found a same-named member of another kind.
- `Variable Expected` - a construct requires addressable storage rather than a property-produced value.

## External references

- [Free Pascal: Property definition](https://www.freepascal.org/docs-html/ref/refsu33.html)
- [Embarcadero DocWiki: Properties (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Properties_%28Delphi%29)
