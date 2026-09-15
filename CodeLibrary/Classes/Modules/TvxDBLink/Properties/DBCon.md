---
title: DBCon
description: Lazily loads and returns the database-connection module configured for this data-definition link.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-link
  - database-connection
  - lazy-loading
---

```Delphi
property DBCon: TvxDBCon read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Link: TvxDBLink;
  Con: TvxDBCon;
begin
  Value := Null;
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

`DBCon` loads on first access and returns the database-connection module configured for this data-definition link.

**Failures and value refresh**

The getter catches a load exception and logs `Error loading DB Connection "<name>"`, but it does not clean up the object in that exception handler. Consequently:

- a normal unresolved/missing module returns nil;
- an exceptional load can return a non-nil partially initialised/unloaded object;
- the logged error can set the surrounding log/status false even though the exception is not re-raised here; and
- any non-nil result is cached, so later reads do not retry or reload it.

If the normal failure path returns nil, a later access tries again. If configuration changes after a successful cached load, this property still returns the existing object until the owning link/definition is recreated.

**Ownership and safe use**

Do not free, replace or retain the result beyond the owning execution/definition lifetime. A nil check prevents dereferencing no object but does not prove that a non-nil result loaded successfully, can connect, is authorised or has current credentials. Operations such as transactions, disconnect and writable endpoint/credential fields have the side effects documented on `TvxDBCon`.

When obtaining the link from `DBCons[Index]`, check the data-definition reference and `DBConCount` in separate nested tests before indexing. Do not assume Boolean evaluation will protect an unsafe dereference in a combined expression.

### Additional Technical Info
`DBCon` returns the [`TvxDBCon`](../../TvxDBCon.md) module referenced by this link, loading it from Velox configuration on first access.

The property is read-only, can return nil and returns a Velox-owned live object rather than a copy.

**Getter implementation**

When the cached field is nil, the getter:

1. creates a `TvxDBCon` owned by this `TvxDBLink`;
2. calls `LoadModule` with the link's configured connection FID and an empty parent FID;
3. frees/nils the object when loading returns normally but `ModuleLoaded` is false; and
4. otherwise retains and returns the object for subsequent accesses.

This configuration load can query VxConfig. It does not itself call the connection's target-database `ConnectDatabase` path; methods/properties on the returned object determine whether target connection/pool work follows.

**Performance and concurrency**

The first/failed access can perform configuration I/O and logging; cached reads are constant-time. No locking protects the lazy cache. Resolve/use it within one action thread.

**Related entries**

- [`TvxDBLink`](../../TvxDBLink.md) — collection, ownership and lifecycle context.
- [`TvxDBCon`](../../TvxDBCon.md) — returned module contract.

<small>Created 2026-07-15</small>
