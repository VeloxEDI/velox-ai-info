---
title: OnChange
description: Assigns the synchronous notification invoked after a list mutation or outer update batch has completed.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, string-list, onchange, event, callback]
---

```Delphi
property OnChange: TNotifyEvent read write;

TNotifyEvent = procedure(Sender: TObject);
```

### Example

```Delphi
var
  ChangeCount: Integer;

procedure ListChanged(Sender: TObject);
begin
  ChangeCount := ChangeCount + 1;
end;

procedure ScriptEvent(var Value: variant);
var
  Names: TStringList;
begin
  Names := TStringList.Create;
  try
    ChangeCount := 0;
    Names.OnChange := ListChanged;
    Names.Add('Alpha');
    Value := ChangeCount;
    Names.OnChange := nil;
  finally
    Names.Free;
  end;
end;
```

### Usage

`OnChange` assigns the synchronous notification invoked after a list mutation or outer update batch has completed.

### Additional Technical Info
`OnChange` holds a PascalScript event handler invoked synchronously after a successful list mutation. `Sender` is the same [`TStringList`](../../TStringList.md) instance, but the event type and hidden ancestor path have no separate public page.

Typical calls include `Add`, `Insert`, `Delete`, `Clear` when nonempty, indexed String/object writes, actual sorting and comparator-driven re-sorting. No-op operations do not necessarily notify: clearing an empty list, sorting zero/one entries or an already sorted list, assigning an unchanged setting, and ignored duplicate insertion send no change event. Assigning the event property itself also sends no event.

The callback observes the new state. If it raises, the exception propagates to the mutating caller after the state change; catching it must not be interpreted as rollback. Sorting or other multi-element work has already completed before the normal callback, although an earlier internal failure can produce separate partial-state behavior.

During inherited `BeginUpdate`/`EndUpdate`, element-level callbacks are suppressed while the update count is positive. The outermost `BeginUpdate` invokes the pre-change boundary and the matching outermost `EndUpdate` invokes this post-change boundary, even if caller code made no effective element change. Nested updates produce only the outer boundary pair when balanced.

Handlers run on the same flow/thread and should be short. Mutating the same list in the callback can recursively trigger events and invalidate indexes/iteration. Do not free the sender, retain it beyond its owner, or assume thread safety. Set the property to nil before teardown when surrounding code can trigger late work; native destruction also clears event fields.

The source-reviewed example uses a matching global procedure and clears the handler before freeing the list. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TStringList.OnChange`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStringList.OnChange) - Delphi event reference.
- [Free Pascal: `TStringList.OnChange`](https://www.freepascal.org/docs-html/rtl/classes/tstringlist.onchange.html) - compatible post-change notification context.

<small>Created 2026-07-15</small>
