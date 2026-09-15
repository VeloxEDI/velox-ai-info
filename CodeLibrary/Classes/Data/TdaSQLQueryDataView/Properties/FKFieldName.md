---
title: FKFieldName
description: Returns the cached SQL field name of the first configured primary/foreign or foreign-key field in the active view.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, sql, foreign-key, field-name, metadata]
---

```Delphi
property FKFieldName: string read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Dataview.FKFieldName;
  if Value = '' then
    LogWarning('The current SQL view has no initialised foreign-key field.');
end;
```

### Usage

`FKFieldName` returns the cached SQL field name of the first configured primary/foreign or foreign-key field in the active view.

**Behaviour**

- A non-empty result is cached and returned without another scan.
- No qualifying descriptor, an inactive/not-yet-opened view or an empty SQL field name returns an empty string.
- An empty result is not permanently cached, so a later read after activation can succeed.

**Important usage notes**

- The getter stops at the first qualifying descriptor; composite and additional foreign keys are not represented.
- The non-empty cache is never cleared by SQL/link changes, deactivation or primary-key-list recreation. Reconfiguring a live view can therefore leave a stale name.
- The returned name is metadata, not validated SQL text. Do not concatenate it with untrusted text or assume it is quoted for a separately constructed statement.

**Errors**

The getter normally returns empty rather than raising when metadata is unavailable. Failures during view activation/key creation are handled by that lifecycle and can leave the list empty.

**Usage notes**

Read this property after the view has opened. For multiple links, use the configured data definition rather than treating this convenience value as a complete relationship description.

### Additional Technical Info
`FKFieldName` returns the dataset/SQL field name for the first key descriptor classified as a primary/foreign key or foreign key. It is useful when a configured SQL view has a conventional first master-detail link, but it is not a list of every foreign key.

The example reads the name after the host has prepared the view. It is source-reviewed and was not executed by the documentation workflow.

The result is the selected `TdaField.SQLFieldName`, which is the name used by Query's dataset field rather than necessarily the physical database column expression.

**Implementation**

The getter checks its private cache. While the cache is empty, it scans the view's primary-key descriptor list in order and stops at the first descriptor whose type is `fftPrimaryForeignKey` or `fftForeignKey`. It returns that descriptor's `SQLFieldName`. The descriptor list is recreated when the view is activated and deleted when it is closed.

**Side effects**

Reading scans current key metadata only when the cache is empty. It does not move Query, resolve the master field or update the database.

**Performance and concurrency**

The first successful read is linear in the small primary-key list; cached reads are constant-time. The cache and key list are unsynchronised and belong to the owning flow.

<small>Created 2026-07-15</small>
