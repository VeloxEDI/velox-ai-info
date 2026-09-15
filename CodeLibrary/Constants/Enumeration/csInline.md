---
title: csInline
description: "Marks an inline or nested design instance, such as a frame embedded in another design."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, inline, frame, design]
---

```Delphi
csInline = 9
```

### Example

```Delphi
function IsInlineDesignComponent(const State: TComponentState): Boolean;
begin
  Result := csInline in State;
end;
```

### Usage

`csInline` marks an inline or nested design instance, such as a frame embedded in another design.

### Additional Technical Info
`csInline` is member ordinal 9 of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). It marks an inline/nested design instance, typically a frame embedded within another design.

The state is relevant to component streaming and designer behavior. It does not mean a script statement is inlined, that an object is memory-embedded, or that a Velox module is nested. Normal runtime code should not infer ownership or persistence from it.

The framework controls the read-only flag. Use named set membership and do not serialize the bit position. The example is source-reviewed only; no inline component was created.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - inline-state definition.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible component state.

<small>Created 2026-07-15</small>
