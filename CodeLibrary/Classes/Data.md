---
title: Data
description: Reference classes for dataset cursors, fields, views and record-bound values used by Velox scripts.
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, data, datasets, fields]
---

The Data classes expose live datasets, fields and views used by Velox processing. Use this branch when a script must navigate records, inspect or change a field, work with a typed field value, or transfer BLOB data.

## Common tasks

- Obtain fields from a host-provided dataset with `FieldByName` or `Fields`, then use the class that matches the field's actual runtime type.
- Use `TvxClientDataSet` for Velox-owned in-memory working data and the query-view classes for their configured database result sets.
- Use `TBlobField` stream methods when content must remain byte-for-byte binary. Treat text conversion as an explicit encoding decision.

## Important behaviour

These are live object references, not detached values. A field refers to the current record of its owning dataset; moving, filtering, closing or destroying that dataset changes what the same field reference can read or write. Scripts normally borrow datasets and fields from Velox and must not free them unless the script explicitly created the object.

Reading generally requires an active dataset and a valid current record. Writing also depends on the field being writable and the dataset being in an edit, insert or equivalent state. A field assignment changes the current record buffer; `Post`, transaction handling and persistence to an external database are separate operations.

File, stream and query operations run synchronously under the identity of the executing Velox Designer, Velox Service or Velox API Service process. Paths, database access and failures therefore depend on that host context.

## Edge cases and quirks

- Null, empty and zero are distinct states for many field types. Check the entry for the exact conversion behaviour.
- Dataset navigation is shared mutable cursor state. A nested helper can move the record seen by its caller.
- Returned fields, field collections and views are borrowed references. Closing or rebuilding their owner can invalidate them.
- Dataset implementations can differ in BLOB buffering, update timing and error handling. Entry pages identify behaviour verified for the common Velox client-dataset path.
- Data objects do not provide automatic cross-thread coordination. Do not navigate or edit the same dataset concurrently.

## Related groups

- [Data variables](../Variables/Data.md) provide the named datasets that Velox binds into script scope.
- [Modules classes](Modules.md) expose map, connection and action objects that own or consume data.
