---
title: ModuleDescription
description: Gets or sets the live human-readable module-kind label used by Velox diagnostics and export naming rather than the concrete class identity.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, description, diagnostics, metadata]
---

```Delphi
property ModuleDescription: string read write;
```

### Example

```Delphi
function DescribeModule(const Module: TvxDBCon): string;
begin
  Result := Module.ModuleDescription + ': ' + Module.ModuleName;
end;
```

### Usage

`ModuleDescription` gets or sets the live human-readable module-kind label used by Velox diagnostics and export naming rather than the class identity.

- Prefer read-only use for diagnostics and labels.
- Never branch security- or processing-critical logic on this mutable display string; use the [`ModuleType`](ModuleType.md) or explicit configuration.
- Do not change it merely to rename a module; use `ModuleName` through the supported configuration workflow.

### Additional Technical Info
`ModuleDescription` is a human-readable type label such as a descendant's configured description. It is distinct from [`ModuleName`](ModuleName.md), [`ModuleType`](ModuleType.md) and the module GUID.

#### Source-backed behaviour

The property directly accesses `FModuleDescription`. Base `New` assigns `BASE MODULE`; concrete descendants normally replace it with their own type label. Velox uses the value in error/log messages, confirmation text, default names and Config Template export naming.

Assignment has no validation and does not change the Delphi class, configuration table, `ModuleType`, permissions or processing behaviour. The base module add/save SQL and serialised published template do not persist a separate description value; it normally comes from the concrete class's `New` initialisation.

Changing it can make subsequent logs and dialogs misleading even though the module still behaves as its original concrete type.

<small>Created 2026-07-15</small>
