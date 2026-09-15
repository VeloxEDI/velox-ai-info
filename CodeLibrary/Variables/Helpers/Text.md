---
title: "Text"
description: "Returns a lazily created scripter-local TStringList workspace that is separate from List in the current implementation."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - helpers
  - text
---

```Delphi
function Text: TStringList;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Text.Clear;
  Text.Add('Example');
  Value := Text.Text;
end;
```

### Usage

Use `Text` as a reusable `TStringList` workspace, especially for building or parsing line-oriented text. Clear it before unrelated work, copy out values that must remain unchanged after later scripts run, and do not free it.

`Text` and [`List`](List.md) are separate workspaces in current Velox; changing one does not change the other.

Changes to `Text` remain available to later scripts in the same execution. Reading `Text` alone does not load or save any data.

### Additional Technical Info
`Text` is a no-argument Velox scripting helper that returns a live object. It does not copy the object or make the returned reference private to the calling statement.

| Property | Detail |
|---|---|
| Return type | `TStringList` |
| Ownership | Scripter-owned |
| Creation/access | Getter call; see lifecycle below |
| Thread safety | Mutable and not safe for concurrent/asynchronous use |

**Identity, creation and lifetime**

The getter lazily creates `TvxScripter.FTEXT`, returns it on later calls and frees it with the scripter.

**Failures, safety and implementation cautions**

The object is a mutable scripter-local workspace. `Text` property line endings, encoding at later file/stream boundaries, name-value parsing, sorting and duplicate rules require explicit handling. Clear it before reuse; never free it or retain it beyond the scripter.

Class methods can raise on invalid state, parsing/conversion failures, I/O errors or invalid arguments unless their own contract documents a different result. Copy required scalar results before another script or operation can replace mutable state.

**Related entry**

- [`TStringList`](../../Classes/Lists/TStringList.md) documents the returned class and its exposed methods/properties.
- [`Helpers`](../Helpers.md) compares lifetime, sharing and context rules for all helper objects.

**External references**

- [Embarcadero DocWiki: `TStringList`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStringList) documents the Delphi class.
- [Free Pascal: `TStringList`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.html) provides compatibility context; Velox uses Delphi.

<small>Created 2026-07-15</small>
