---
title: csDesignInstance
description: "Marks the root component instance currently represented by a designer, normally together with csDesigning."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, design-instance, root]
---

```Delphi
csDesignInstance = 10
```

### Example

```Delphi
function IsDesignerRoot(const State: TComponentState): Boolean;
begin
  Result := (csDesignInstance in State) and (csDesigning in State);
end;
```

### Usage

`csDesignInstance` marks the root component instance currently represented by a designer, normally together with csDesigning.

### Additional Technical Info
`csDesignInstance` is member ordinal 10 and the last current member of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). It identifies the root object represented by a designer and appears with `csDesigning` in normal framework use.

It does not mean the component is the root of a Velox execution flow, module tree, dataset hierarchy or ownership graph. It carries no object reference and grants no modification authority.

The read-only flag is a transient design-framework detail. Check membership by name and avoid persisting its ordinal/bit because enum extension could change a serialized numeric contract. The example is source-reviewed only.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - design-instance definition.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible component-state context.

<small>Created 2026-07-15</small>
