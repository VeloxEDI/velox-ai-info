---
title: CaseSensitive
description: Controls whether list comparisons distinguish letter case and re-sorts an already sorted list when the mode changes.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, case-sensitive, comparison, locale]
---

```Delphi
property CaseSensitive: Boolean read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    Names.CaseSensitive := True;
    Names.Sorted := True;
    Names.Add('alpha');
    Names.Add('Alpha');
    Value := Names.Count;  // the spellings compare separately
  finally
    Names.Free;
  end;
end;
```

### Usage

`CaseSensitive` controls whether list comparisons distinguish letter case and re-sorts an already sorted list when the mode changes.

### Additional Technical Info
`CaseSensitive` selects the comparator used by [`Find`](../Methods/Find.md), [`Sort`](../Methods/Sort.md), sorted insertion and inherited searches such as `IndexOf`. It defaults to false.

With the hidden inherited `UseLocale=True` default, false selects Delphi `AnsiCompareText` and true selects `AnsiCompareStr`. Both are locale-aware. The importer does not expose `UseLocale`, so enabling case sensitivity does not make comparison ordinal or invariant; punctuation, accents and national characters can still follow process/operating-system collation rules.

Assigning the existing value is a no-op. On an unsorted list, changing it stores the field only: physical order is unchanged and neither [`OnChanging`](OnChanging.md) nor [`OnChange`](OnChange.md) runs. Any previous one-time sort may now be invalid under the new comparator.

On a list with [`Sorted=True`](Sorted.md), the setter stores the new case mode, temporarily clears the sorted flag and restores it. Restoration invokes a re-sort when `Count > 1`, with the normal before/after events. Zero- and one-entry lists update the mode/flag without callbacks.

This transition is not transactional. If a sorting/event exception occurs, the case mode has already changed and the list can remain `Sorted=False`, partially reordered or fully reordered without successful completion. Re-read both properties after handling an exception.

Changing comparison can make previously distinct values equal or the reverse. [`Duplicates`](Duplicates.md) is not applied retroactively, so the re-sort retains every existing entry even under `dupIgnore` or `dupError`.

The source-reviewed example establishes case mode before sorted insertion. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.CaseSensitive`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.CaseSensitive) - Delphi property reference.
- [Free Pascal: `TStringList.CaseSensitive`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.casesensitive.html) - compatible comparison-mode context; Velox locale details are Delphi-specific.

<small>Created 2026-07-15</small>
