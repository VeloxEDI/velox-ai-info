---
title: Count
description: Returns the number of stored boundary strings, which is the MIME nesting depth and the authoritative empty-stack check.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, boundary, count, stack-depth]
---

```Delphi
function Count: Integer;
```

### Example

```Delphi
procedure HasBoundary(const BoundaryStack: TIdMIMEBoundary;
  var Value: Variant);
begin
  Value := BoundaryStack.Count > 0;
end;
```

### Usage

`Count` returns the number of stored boundary strings, which is the MIME nesting depth and the authoritative empty-stack check.

### Additional Technical Info
`Count` returns the item count of the internal boundary-string list. Under normal paired operation this is also the current MIME nesting depth and the number of stored parent-part indexes.

Use `Count > 0` to determine whether [`Boundary`](../Properties/Boundary.md) represents a stack entry. Testing `Boundary <> ''` is not equivalent because [`Push`](Push.md) permits an empty boundary string.

The method deliberately does not compare the parallel parent-part list. If an earlier partial failure or unsafe concurrent mutation desynchronized the two lists, `Count` reports only the boundary side and does not detect or repair the mismatch.

The read is constant-time and has no side effects, but the mutable object provides no synchronization. The source-reviewed example uses it as the authoritative empty check and was not runtime-tested.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.Count`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.Count) - underlying count property.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) - compatible core list context; Velox uses Delphi.

<small>Created 2026-07-15</small>
