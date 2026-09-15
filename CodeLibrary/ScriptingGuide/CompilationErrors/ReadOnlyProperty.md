---
title: "Read-only property"
description: "Why assignment fails when a script-visible class property has no registered setter."
sidebar_position: 35
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - properties
  - assignment
---

Velox reports `Read-only property` when a script assigns to a registered class or static property for which the compiler has no setter procedure. Reading the same property can still be valid when a getter is registered.

## Example

`TCollectionItem.ID` is exposed for reading but has no script setter:

```Delphi
procedure UpdateItem(Item: TCollectionItem; var Value: Variant);
begin
  Item.ID := 10; // Error: Read-only property
  Value := Item.ID;
end;
```

Read the value, or change the object through an appropriate documented method or writable property:

```Delphi
Value := Item.ID;
```

## How Velox detects it

The compiler resolves the property and parses any index parameters. When it sees `:=`, it asks the compile-time class registration for the property's setter procedure. If `Property_Set` returns false, the compiler emits `ecReadOnlyProperty` and does not generate a call.

The same check applies to simple, indexed/default and registered static properties. A property's underlying Delphi class might have an internal field or protected setter; scripts can use only the accessor that the Velox import explicitly registered.

## Correction procedure

1. Confirm that the identifier is a property and that the assignment targets the property itself.
2. Check its Code Library page for read/write availability.
3. Use a documented method or writable property that performs the intended state change.
4. If the property should be writable but the setter is missing from the current registration, retain the evidence and raise a product/import issue rather than inventing a workaround.

## Edge cases and quirks

- This is a compile-time access error. A registered setter that later raises an exception follows the runtime error path instead.
- Indexed properties validate their index arguments before setter lookup, so a count or type error can appear first.
- A read-only property can return a mutable object. Mutating that returned object's documented members is different from assigning a new value to the property, but ownership and lifetime rules still apply.
- Passing a property as a `var` parameter can report `Variable Expected` because a property accessor is not ordinary addressable storage.

## Related reference

- `Write-only property` - a setter exists but no getter is registered.
- `Not a property` - a host default-property registration named a non-property item.
- `Assignment (':=') expected` - assignment syntax rather than property accessibility.

## External references

- [Free Pascal: Property definition](https://www.freepascal.org/docs-html/ref/refsu33.html)
- [Embarcadero DocWiki: Properties (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Properties_%28Delphi%29)
