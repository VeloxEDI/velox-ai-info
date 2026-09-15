---
title: EnableLogUserReporting
description: Gets or sets a global reporting flag that is stored and transferred but currently has no operational product consumer.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, reporting, compatibility]
---

```Delphi
property EnableLogUserReporting: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.EnableLogUserReporting
  else
    Value := False;
end;
```

### Usage

`EnableLogUserReporting` gets or sets a global reporting flag that is stored and transferred but currently has no operational product consumer.

### Additional Technical Info
`EnableLogUserReporting` is a process-global Boolean setup field. New setup state defaults it to `False`.

The getter/setter lock Setup around the direct field operation. Transfer/reload copies the field and the General Setup screen can edit it.

**Current implementation status**

In the current product source, no logging, reporting or service runtime reads this flag. Its only readers/writers are the setup class, script registration and General Setup UI. Setting it therefore changes stored in-memory configuration but does not currently enable a user-reporting workflow, change log visibility, send a report or grant access.

Treat it as a reserved/compatibility setting. Do not branch critical configuration on an assumed side effect, and do not infer that a future release will retain the same dormant behaviour.

The assignment is global, thread-locked for that single write and not automatically persisted. Prefer read-only diagnostics in scripts and use governed setup administration if a durable value is required.

<small>Created 2026-07-15</small>
