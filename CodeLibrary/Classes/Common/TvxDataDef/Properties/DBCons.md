---
title: DBCons
description: Returns a zero-based database-link object by its current configuration-list index without performing bounds checking.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, data-definition, database-link, indexed-property]
---

```Delphi
property DBCons[Index: Integer]: TvxDBLink read;
```

### Example

```Delphi
function CheckConfiguredLinks(const Data: TvxDBDef): Boolean;
var
  I: Integer;
  Link: TvxDBLink;
begin
  Result := False;
  if Data = nil then
  begin
    LogError('No data definition is available.');
    Exit;
  end;
  for I := 0 to Data.DBConCount - 1 do
  begin
    Link := Data.DBCons[I];
    if Link = nil then
    begin
      LogError('Database link ' + IntToStr(I) + ' is unavailable.');
      Exit;
    end;
    if Link.DBCon = nil then
    begin
      LogError('Database connection ' + IntToStr(I) + ' did not load.');
      Exit;
    end;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md).

### Usage

`DBCons` returns a zero-based database-link object by its current configuration-list index without performing bounds checking.

- Re-read `DBConCount` and stay within `0..count-1` in the same operation.
- Check `DBCons[I]` and its `DBCon` result before use; do not confuse the link with the connection.
- Do not assume index zero is semantically primary unless the module configuration defines it that way.

### Additional Technical Info
`DBCons[index]` returns one `TvxDBLink` from the data definition's current ordered list. The returned object describes a link to a connection; it is not itself the `TvxDBCon`.

#### Source-backed behaviour

The getter casts `FDBCons[Index]` directly. Indexing is zero-based and there is no local range guard. Negative indexes or values at/above [`DBConCount`](DBConCount.md) raise through the underlying list.

Reading the link is cheap, but subsequently reading its `DBCon` property may create a connection object, load its module from configuration and log a failure before returning nil. Link order is configuration order and is also the order used by the group transaction methods.

The list and its objects are owned by the data definition. Module transfer/loading can free and rebuild them, so retained references can become invalid.

#### Related entries

- [`DBCon`](DBCon.md) is the unguarded `DBCons[0].DBCon` shortcut.
- [`StartTransaction`](../Methods/StartTransaction.md) visits these links in this order.
- [`TvxDBLink`](../../../Modules/TvxDBLink.md) documents the returned type.

<small>Created 2026-07-15</small>
