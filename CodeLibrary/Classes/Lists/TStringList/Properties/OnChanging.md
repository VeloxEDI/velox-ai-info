---
title: OnChanging
description: Assigns the synchronous notification invoked before a list mutation or at the start of an outer update batch.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, onchanging, event, callback]
---

```Delphi
property OnChanging: TNotifyEvent read write;

TNotifyEvent = procedure(Sender: TObject);
```

### Example

```Delphi
var
  BeforeCount: Integer;

procedure ListChanging(Sender: TObject);
begin
  BeforeCount := BeforeCount + 1;
end;

procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    BeforeCount := 0;
    Names.OnChanging := ListChanging;
    Names.Add('Alpha');
    Value := BeforeCount;
    Names.OnChanging := nil;
  finally
    Names.Free;
  end;
end;
```

### Usage

`OnChanging` assigns the synchronous notification invoked before a list mutation or at the start of an outer update batch.

### Additional Technical Info
`OnChanging` holds a PascalScript event handler invoked synchronously before a list mutation. `Sender` is the same [`TStringList`](../../TStringList.md) object and still exposes its pre-operation state at the start of an ordinary mutation.

The event runs before `Add`, `Insert`, `Delete`, nonempty `Clear`, indexed writes, actual sorting and related operations. It is not a universal property-change event: setting `Duplicates`, changing `CaseSensitive` on an unsorted list, assigning an event handler, ignored duplicate insertion and other no-ops do not call it.

If the handler raises, the ordinary operation has not yet changed the list and the exception propagates. Do not rely on this as a general transaction boundary, however: a complex calling operation can have performed earlier steps before reaching a later mutation, and comparator-mode transitions store the new mode before they initiate a sorting callback.

The outermost inherited `BeginUpdate` invokes `OnChanging` immediately before incrementing the update count. Mutations during the batch suppress their own events, and the final outermost `EndUpdate` invokes [`OnChange`](OnChange.md). The boundary callbacks occur even if the batch makes no effective element change. An exception from `OnChanging` prevents `BeginUpdate` from starting, so a `finally` block must not blindly call `EndUpdate` unless begin succeeded.

Handlers run reentrantly on the same flow/thread. Mutating the sender from the handler can invoke `OnChanging` again indefinitely or alter the state the outer operation is about to edit. Use the callback for short observation/validation, avoid re-entry, and never free the sender there.

The source-reviewed example assigns a matching global procedure, observes one pre-add notification and clears it before destruction. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.OnChanging`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.OnChanging) - Delphi pre-change event reference.
- [Free Pascal: `TStringList.OnChanging`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.onchanging.html) - compatible pre-change notification context.

<small>Created 2026-07-15</small>
