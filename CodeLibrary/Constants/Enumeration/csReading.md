---
title: csReading
description: "Marks the component-stream phase in which property values are being read, normally while csLoading is also set."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, component-state, reading, properties, streaming]
---

```Delphi
csReading = 1
```

### Example

```Delphi
function IsReadingProperties(const State: TComponentState): Boolean;
begin
  Result := csReading in State;
end;
```

### Usage

`csReading` marks the component-stream phase in which property values are being read, normally while csLoading is also set.

### Additional Technical Info
`csReading` is member ordinal 1 of the component-state element enumeration used by [`TComponentState`](../../Types/Sets/TComponentState.md). It reports the active property-reading phase of Delphi component streaming and normally appears together with `csLoading`.

Property setters can run while sibling properties and referenced components are incomplete. Velox/product code uses this flag with `csLoading` to suppress premature processing in connection, file and action components.

This does not mean a file, dataset or network response is being read for business processing. It describes framework property deserialization only. Scripts cannot set it and should not use it as a concurrency guard. The example is source-reviewed only.

**External references**

- [Embarcadero TComponentState](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.Classes.TComponentState) - reading-state meaning.
- [Free Pascal TComponentState](https://www.freepascal.org/docs-html/rtl/classes/tcomponentstate.html) - compatible component-state flag.

<small>Created 2026-07-15</small>
