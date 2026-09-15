---
title: "Flags"
description: "Context-bound control gates and action reference fields exposed as mutable scripting flags."
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - flags
  - control-flow
---

Flags are direct pointers into scripter, action, view-map or map state. Assignment changes the underlying live field immediately. Their effects differ: some are consumed by a proven core path, while others are reference signals that only a configured scriptlet/downstream process can interpret.

## Binding and effect matrix

| Flag | Binding | Reset/default | Proven core effect |
|---|---|---|---|
| `Handled` | Scripter | False in custom transport setup | Context-specific HTTP/IMAP standard-handling/message-disposition control |
| `IsChanged` | Action | False | Storage/reference signal; no universal consumer proven |
| `IsRecordChanged` | Current field/view map | False per reset/new record | Storage/reference signal; valid only in field/view-map context |
| `NotifyCompany`, `NotifyPartner` | Action | False | Storage/reference signals; notification requires downstream consumer |
| Notification/send event integers | Action | -1 | Store identifiers; do not create events/notifications on assignment |
| `SaveData` | Map | True | Gates normal final `Dest.SaveData` call |
| `SourceNum`, `StatusNum`, `TypeNum` | Action | -1 | Generic configured references; no automatic lookup/update |
| `UserNum` | Action | -1; API context may assign | Carries user reference; not authentication/authorisation |

## General rules

- A flag is not a command unless its page identifies the exact consuming source path.
- Initialise/reference flags deliberately and treat `-1` as the default unset sentinel unless the local contract says otherwise.
- Validate every numeric identifier against the correct table/domain and application/tenant scope.
- `SaveData=False` only skips the normal final map save; it cannot roll back explicit SQL, files, APIs or other side effects.
- `Handled` has different meanings in HTTP and IMAP custom processing and is separate from the procedure's `Value` success result.
- Context-bound flags can be registered for compilation even when no runtime pointer is assigned. Do not use map/view flags outside their documented contexts.
- Direct pointer assignment can bypass higher-level validation/setter behaviour. It never authenticates, persists or audits by itself.

Flags are mutable and not safe for asynchronous/concurrent use. Log important control decisions without exposing sensitive values, and keep business-critical effects in explicit, observable workflows.

<small>Created 2026-07-19</small>
