---
title: "List"
description: "Returns a lazily created scripter-local TStringList workspace that is separate from Text in the current implementation."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - list
---

```Delphi
function List: TStringList;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  List.Clear;
  List.Add('Example');
  Value := List.Text;
end;
```

### Usage

Use `List` as a reusable `TStringList` workspace for building, sorting or searching a list of strings. Clear it before starting unrelated work and copy out values that must remain unchanged after later scripts run. Do not free it.

`List` and [`Text`](Text.md) are separate workspaces in current Velox; changing one does not change the other.

Changes to `List` remain available to later scripts in the same execution. Reading `List` alone does not load or save any data.

### Additional Technical Info
`List` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TStringList` |
| Ownership | Scripter-owned |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Identity, creation and lifetime**

The getter lazily creates `TvxScripter.FList`, returns that instance on later calls and frees it with the scripter.

**Failures, safety and implementation cautions**

The list is mutable state local to the scripter, not an action-wide cache. Clear it before reuse, account for newline/name-value/duplicate/sorted-list semantics when using inherited operations, and do not free or expose it to asynchronous work.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TStringList`](../../Classes/Lists/TStringList.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [Embarcadero DocWiki: `TStringList`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringList) documents the Delphi class.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
