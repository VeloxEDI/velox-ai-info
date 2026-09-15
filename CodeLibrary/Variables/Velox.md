---
title: "Velox"
description: "Current issue and event query-dataview pointers used by the standard Velox scriptlet workflow."
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - issue
  - event
---

`DEvent` and `DIssue` are live pointers used by the standard Velox scriptlet's event/issue workflow. They do not create, configure or query a dataview. The action fields begin `nil`; the scriptlet's `Initialise(aDIssue, aDEvent)` procedure assigns the supplied `TdaSQLQueryDataView` objects.

## Required initialisation

Call the governed initialisation path with the issue and event dataviews that belong to the current transaction/map contract before any helper expects these variables. Always guard `nil`, and also confirm that the supplied view is in the state required by the class/member you call. A non-nil pointer does not prove an active query, current row or valid schema.

## Shared object state

Each variable aliases the exact supplied dataview. Cursor movement, filters, parameters, SQL/query state, edits and close/open operations are visible through every other reference to that object. Velox does not join issue/event rows, select a connection, create a row or persist an edit merely because the pointer is assigned.

The action's data reset sets both pointers to `nil`. Scripts do not own the views and must never free them or retain them beyond the owning map/action context. The mutable views are not safe for asynchronous or concurrent use.

## Compatibility behaviour

Deprecated `InitialiseInterchange` assigns interchange issue/event views to these current pointers. Deprecated `InitialiseIssue` can reassign `DIssue`, and passing nil makes it fall back to `DInterchangeIssue`. Legacy scripts can therefore change which issue view later functions observe. New work should use `Initialise(Issue, Event)` and transaction-specific issue/event configuration.

## Safety and business meaning

An issue/event dataview row is configured data, not automatic proof that a notification was sent, a transaction failed/succeeded, a database commit occurred or an audit event is complete. Validate required fields and keys, distinguish current-row state from persisted state, and use the documented function that performs the intended effect.

<small>Created 2026-07-19</small>
