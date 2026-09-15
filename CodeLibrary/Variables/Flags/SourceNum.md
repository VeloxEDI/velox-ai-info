---
title: "SourceNum"
description: "General action-level reference intended to carry a configured source-type/source identifier."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - source-reference
---

```Delphi
SourceNum: LongInt
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  SourceNum := 1001;
  Value := SourceNum;
end;
```

### Usage

`SourceNum` is a general action-level reference intended to carry a configured source-type/source identifier.

Validate scope and existence before use. Do not confuse it with the `Source` module object, authentication provenance or audit evidence.

### Additional Technical Info
`SourceNum` is a live mutable scripting flag/reference. Assignment writes directly through the bound pointer; it does not create an isolated local value.

| Property | Detail |
|---|---|
| Runtime binding | `TvxActionMan.FSourceNum` |
| Reset/default | Action data reset assigns `-1` as the unset sentinel. |
| Thread safety | Direct mutable state; not for asynchronous/concurrent mutation |

**Executable effect**

Current core exposes storage without resolving or validating a Source record and without an automatic side effect.

**Context and lifecycle**

The exact identifier domain must be defined by the scriptlet or consumer; it must not be inferred from the generic name.

The owner controls lifetime. Scripts must not retain an address/reference beyond the current context. Later reset or processing stages can overwrite the value.

**Cautions**

Validate scope and existence before use. Do not confuse it with the `Source` module object, authentication provenance or audit evidence.

Assignment is in-memory state mutation. It does not authenticate a caller, validate an identifier, persist a row, commit/roll back a transaction or prove an external effect unless the executable-effect section explicitly says otherwise.

**Related entry**

- [`Flags`](../Flags.md) compares bindings, defaults and proven consumers for the complete group.

**External references**

- This entry is a Velox pointer binding rather than a wrapped Delphi/FPC core function; current product source and the consuming workflow are the behavioural contract.

<small>Created 2026-07-15</small>
