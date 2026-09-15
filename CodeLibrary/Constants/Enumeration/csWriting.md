---
title: csWriting
description: "Marks the component-stream phase in which the framework is writing property values."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, writing, properties, streaming]
---

```Delphi
csWriting = 2
```

### Example

```Delphi
function IsWritingProperties(const State: TComponentState): Boolean;
begin
  Result := csWriting in State;
end;
```

### Usage

`csWriting` marks the component-stream phase in which the framework is writing property values.

### Additional Technical Info
`csWriting` is member ordinal 2 of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). It reports that Delphi's component streaming framework is writing published property values.

Code reached during this phase should avoid unrelated mutations or I/O that would make serialization re-entrant or inconsistent. Current Velox action code uses `csWriting`, `csReading` and `csLoading` together to defer state-sensitive work.

The flag does not mean an ordinary file, stream, database or HTTP body is being written. It is framework-controlled, read-only and transient. The example is source-reviewed only; no component was serialized.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - writing-state definition.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible flag.

<small>Created 2026-07-15</small>
