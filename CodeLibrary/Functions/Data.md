---
title: "Data"
description: "Functions for creating datasets, querying Velox databases, executing SQL and accessing linked mapping data."
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - datasets
  - sql
  - transactions
---

### Description

The Data functions let a Velox script create an in-memory dataset, bind a client dataset to a configured database, execute SQL, obtain a single query value, or expose a dataset through a mapping data view.

These entries are deliberately separate because similarly named functions have materially different contracts. `ExecSQLData`, for example, opens a caller-supplied dataset even though its name starts with `ExecSQL`; `ExecSQLDestCommit` completes a destination transaction immediately, while `ExecSQLDest` leaves transaction completion to the surrounding Velox flow. Read each entry before choosing a helper.

**Connection families**

| Family | Connection selected |
|---|---|
| `GetConfig` | Velox configuration database (`SQLC`). |
| `GetData`, `ExecSQL`, `ExecSQLData` | Velox Data database (`SQLD`). |
| `...Source` | A source connection; wrappers without an index use index `0`. |
| `...Dest` | A destination connection; wrappers without an index use index `0`. |
| `GetDataFromDB` | A DB Connection module selected by its FID. |

Indexed source and destination arguments are zero-based and are resolved against the active map's configured connection lists. The dataset-opening methods perform lookup inside their exception handler and log/suppress an invalid index. The indexed `ExecSQLStatement...` and `GetSQLValue...` methods evaluate the list lookup before entering their query `try` block, so an invalid index propagates into the script.

**Dataset ownership**

Dataset-query procedures mutate the object passed by the caller. They close it, clear field definitions, disable SQL parameter checking, replace its connection and command text, and then open it. Existing fields, cursor position and pending edits must not be expected to survive. The caller or Velox context retains ownership; these functions do not return a new independent copy.

See [Datasets](../ScriptingGuide/Datasets.md) for cursor, editing, null and ownership fundamentals.

**SQL and transaction safety**

All SQL is executed synchronously. The implementation assigns or appends the supplied SQL text directly and sets `ParamCheck := False`; it does not parse values into parameters or make concatenated text safe. Construct SQL only from trusted, correctly quoted input and prefer configuration or database mechanisms that avoid script-built SQL where possible.

The Boolean execution functions report whether their immediate implementation reached its success assignment. They do not prove that a surrounding transaction was committed. Most functions catch database exceptions, log them and return `False`, `Null`, or no status; consult the Velox log when a result is ambiguous.

Destination DB Connection modules can also have transactions disabled. In that configuration their Velox start, commit and rollback wrappers are no-ops. Test mode therefore cannot be assumed to roll back SQL executed through an immediate-completion helper when transactions are disabled.

**Linked views and concurrency**

`LinkDataView`, `GetLinkedData` and `GetDataViewforDataSet` all reuse one scripter-owned view and rebind it on later calls. `LinkedData` is different: it returns the active map context's current linked view. These are live, mutable objects, not snapshots, and must not be freed by scripts.

Database connections, datasets and cached views belong to an executing Velox context. Do not share or retain them across concurrent executions or beyond the event that supplied them.

<small>Created 2026-07-15</small>
