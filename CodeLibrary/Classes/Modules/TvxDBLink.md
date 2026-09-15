---
title: TvxDBLink
description: Represents a data definition's configured link to a lazily loaded Velox database-connection module.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - database-link
---

```Delphi
TvxDBLink = class(TvxLogRelative)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Link: TvxDBLink;
  Con: TvxDBCon;
begin
  Value := '';
  if Source <> nil then
    if Source.DBConCount > 0 then
    begin
      Link := Source.DBCons[0];
      if Link <> nil then
      begin
        Con := Link.DBCon;
        if Con <> nil then
          Value := Con.Database;
      end;
    end;
end;
```

### Usage

`TvxDBLink` represents a data definition's configured database connection. The connection is loaded when first requested.

### Additional Technical Info
`TvxDBLink` is the script-visible link object between a data definition and one configured [`TvxDBCon`](TvxDBCon.md) module. It stores the connection-module identity/name natively and resolves that configuration to a live connection object on demand.

**Acquisition and public surface**

The scripting import declares only the read-only [`DBCon`](TvxDBLink/Properties/DBCon.md) property. It does not register a constructor, identifier/name fields, SQLDATA name, ReportBuilder data settings or a disconnect method.

Velox creates/loads link objects as children of a data definition. A database or file definition exposes its links through the inherited zero-based `DBCons[Index]` collection and `DBConCount`. Bounds-check the count before indexing: the native indexed getter directly reads its list and has no explicit range guard.

**Resolution and ownership**

On first `DBCon` access, the link constructs a `TvxDBCon` with the link as its component owner and loads the configured module from VxConfig. A normal load that does not produce a loaded module frees the object and returns nil. A successful object is cached for all later reads.

The link owns the cached `TvxDBCon`; callers must not free or replace it. Destroying/removing the link or replacing/freeing the definition's link collection frees the link, which in turn frees its owned connection module. The connection module does not own its eventual pooled SQLDATA object.

**Behaviour and quirks**

- Resolving the property loads Velox connection configuration. It does not by itself guarantee a connection to the target database.
- The loader catches exceptions and logs an error, but that exception path does not free or nil the newly created `TvxDBCon`. It can return a non-nil object whose module did not finish loading. Treat non-nil only as a reference check, not proof of valid configuration or connectivity.
- After successful or exceptional non-nil resolution, later reads return the cached object without reloading. Native link/configuration changes are not automatically reflected in that object.
- A nil result can become retryable on a later read because the getter attempts resolution whenever its cache is nil.
- Access can query VxConfig and can change the shared Velox log/status when loading fails.
- Link identity/name are not writable through the scripting surface, but writable properties and state on the returned `TvxDBCon` retain their own side effects and security constraints.

**Performance and concurrency**

The first access can perform VxConfig I/O; cached reads are constant-time. Target database connection/pooling occurs only when later connection operations require it. The link/cache is mutable and unsynchronised, so do not resolve or use one link concurrently across execution threads.

**Related entries**

- [`DBCon`](TvxDBLink/Properties/DBCon.md) — lazy loader and return contract.
- [`TvxDBCon`](TvxDBCon.md) — returned module's configuration, connection and transaction behaviour.
- [`Source`](../../Variables/Modules/Source.md) and [`Dest`](../../Variables/Modules/Dest.md) — context-dependent data definitions that can expose the inherited link collection.

<small>Created 2026-07-15</small>
