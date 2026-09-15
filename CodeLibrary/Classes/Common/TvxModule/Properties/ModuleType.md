---
title: ModuleType
description: Returns the concrete Delphi runtime class name that Velox uses as the module-type discriminator in configuration and relationship records.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, type, class-name, read-only]
---

```Delphi
property ModuleType: string read;
```

### Example

```Delphi
function IsDatabaseDefinition(const Module: TvxDBDef): Boolean;
begin
  Result := Module.ModuleType = 'TvxDBDef';
end;
```

### Usage

`ModuleType` returns the Velox runtime class name that Velox uses as the module-type discriminator in configuration and relationship records.

### Additional Technical Info
`ModuleType` returns the actual native class name of the current object, for example `TvxDBDef` or `TvxFileCon`.

#### Source-backed behaviour

`TvxModule.GetModuleType` returns `Self.ClassName`, so virtual/runtime type is used even though the property is declared on a hidden ancestor. The value is read-only to scripts.

Native add/save operations write it to the module table's `MODULETYPE` field, and relation rows use it as their parent/child type discriminator. It is an implementation class identifier, not [`ModuleDescription`](ModuleDescription.md), a display label, capability test or versioned public protocol. Renamed/legacy Delphi classes may be converted elsewhere during import; this getter itself performs no mapping.

String comparison is exact and class names are ASCII identifiers. Prefer the declared script type or supported Velox type helpers when behaviour depends on capabilities rather than maintaining a hard-coded class-name list.

#### Official runtime-type references

- [Embarcadero: TObject.ClassName](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.ClassName)
- [Free Pascal: TObject.ClassName](https://www.freepascal.org/docs-html/current/rtl/system/tobject.classname.html)

<small>Created 2026-07-15</small>
