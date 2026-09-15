---
title: GetText
description: Allocates and returns a null-terminated PChar containing the list's joined Text representation.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, gettext, pchar, allocation]
---

```Delphi
function GetText: PChar;
```

### Example

```Delphi
procedure PreferManagedText(const Items: TStringList; var Value: string);
begin
  // Text is managed; avoid the raw allocated PChar returned by GetText.
  Value := Items.Text;
end;
```

### Usage

`GetText` allocates and returns a null-terminated PChar containing the list's joined Text representation.

- Prefer [`Text`](../Properties/Text.md), which returns a managed String and requires no manual deallocation.
- Do not retain or pass the pointer across uncertain Velox lifetimes.
- Treat this member as compatibility-only unless the host supplies an explicit allocator/deallocator contract.

### Additional Technical Info
`GetText` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is a low-level allocation API; the managed [`Text`](../Properties/Text.md) property is safer for scripts.

#### Source-backed behaviour

The installed RTL evaluates the same joined text used by `Text`, converts it to `PChar`, and calls `StrNew`. The returned buffer is a new heap allocation, not a pointer into the list, and normally requires a matching `StrDispose` by the caller.

The current Code Library exposes `GetText` but does not expose a matching `StrDispose` routine. Repeated script calls therefore have no documented safe release path and can leak memory. Embedded null characters also terminate PChar consumers before the managed text's logical end.

#### Related members

[`SetText`](SetText.md) accepts PChar input and replaces the list. [`Text`](../Properties/Text.md) is the normal script-facing equivalent.

#### Official RTL references

- [Embarcadero: TStrings.GetText](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.GetText)
- [Free Pascal: TStrings.GetText](https://www.freepascal.org/docs-html/rtl/classes/tstrings.gettext.html)

<small>Created 2026-07-15</small>
