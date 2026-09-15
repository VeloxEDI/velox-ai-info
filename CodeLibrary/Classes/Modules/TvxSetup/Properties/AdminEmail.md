---
title: AdminEmail
description: Gets or sets the global administrative/error recipient default used by actions and newly created email helpers.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, email, administrative-recipient]
---

```Delphi
property AdminEmail: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.AdminEmail
  else
    Value := '';
end;
```

### Usage

`AdminEmail` gets or sets the global administrative/error recipient default used by actions and newly created email helpers.

The raw value can contain tags for an action's later tag-processing context. Outside that context, or for the email helper's construction snapshot, it remains raw text.

**Usage guidance**

The raw value can contain tags for an action's later tag-processing context. Outside that context, or for the email helper's construction snapshot, it remains raw text. Validate the address/list syntax expected by the eventual email component and ensure tags cannot redirect sensitive notifications unexpectedly.

Assignments mutate shared across the Velox process in-memory setup and can affect unrelated executions. They do not call SaveModule and do not prove delivery. Prefer read-only use in mapping scripts and make durable recipient changes through governed General Setup administration.

### Additional Technical Info
`AdminEmail` is the global default recipient for administrative/error email. It defaults to an empty string and is stored as raw text.

The getter and setter lock [`TvxSetup`](../../TvxSetup.md) for one field operation. They do not parse, validate, resolve DNS, send mail or save General Setup.

**Consumers**

- A newly created Velox email helper copies AdminEmail as its default recipient.
- An action configured to use default email reads Setup.AdminEmail and processes action/local tags when resolving its administrative recipient.
- Status-based manager/transport notification paths use their captured administrative address for error/not-set outcomes.

An already-created email helper retains the address copied at construction. A script assignment therefore affects later consumers and live default lookups, not every message already being composed.

<small>Created 2026-07-15</small>
