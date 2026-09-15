---
title: Classes
description: Script-visible object types and their physically owned methods and properties.
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - objects
---

Classes describe the object types imported into the Velox scripting runtime. A class page explains the object's purpose, acquisition and lifetime; its Methods and Properties pages document the callable surface that the script compiler exposes.

## Common tasks

- Start with **Modules** for configured Velox modules used by an action or map.
- Use **Data** for datasets, data views and fields.
- Use **Files**, **HTTP**, **JSON**, **Mail**, **Stream** and **XML** for specialised data or transport objects.
- Use **Config**, **Lists** and **String** for configuration and in-memory support objects.

## Important behaviour

Script-visible inheritance is not the same as file placement. Each method or property is documented once at the physical page for its declaring class. A descendant can use an inherited member without carrying a duplicate page. Some implementation ancestors are deliberately hidden from navigation; their shared member storage must not be treated as a constructible public class.

Many objects are created and owned by Velox and are merely exposed to a script. Calling `Free` or retaining a reference outside the owning event can invalidate engine state. Other entries explicitly return caller-owned objects. Check the class and member page before changing properties or assuming ownership.

## Edge cases and quirks

Only imported members are available. Public Delphi members that were not registered cannot be called from the script. Properties may be read-only, write-only, indexed or backed by an adapter whose behaviour differs from direct Delphi property access. Thread safety, database effects and object validity are specific to the owning class and current script context.

## Related groups

- **Variables** — ways a script obtains live object instances.
- **Functions** — global routines that can create, find or operate on objects.
- **Types** — records, arrays and references that are not class instances.
