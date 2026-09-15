---
title: ForceNull
description: Marks the live field Required so Velox's SQL writer can emit an explicit null, without clearing the field itself.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, 'null', required, sql, validation]
---

```Delphi
procedure ForceNull
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Field.Clear;
  Field.ForceNull;
  Value := Null;
end;
```

### Usage

`ForceNull` marks the live field Required so Velox's SQL writer can emit an explicit null, without clearing the field itself.

**Errors and side effects**

`ForceNull` itself is a constant-time property assignment. Subsequent Post, validation or SQL generation supplies the material effect and may raise. It does not post, execute SQL or commit. The field is dataset-owned and unsynchronised.

### Additional Technical Info
`ForceNull` sets the inherited field property `Required` to true. Despite its name, it does **not** clear the value or assign Variant Null.

**Signature**

The example clears the field separately. It is appropriate only when the destination path uses the Velox writer behavior described below; it was source-reviewed and not executed by this documentation workflow.

**Exact implementation**

```Delphi
Required := True;
```

Velox's custom daDBExpress SQL generation treats the combination `Required = True` and a null value as an instruction to write an explicit SQL `NULL`. A non-null value continues through its normal value path.

This is a product-specific overload of Delphi metadata. Delphi normally defines `Required` to mean that a nonblank value is required. Standard dataset posting/required-field validation can therefore reject the same null value with an `EDatabaseError`. Confirm the destination adapter before using this helper; it is not a portable way to set null.

**State and lifecycle**

- The flag remains true on the shared field object until code changes it or the dataset rebuilds its fields.
- It affects later work on the same field, not only the current assignment.
- Calling it on a non-null field changes only metadata; it does not schedule a future null.
- Calling `Clear` without `ForceNull` sets null but may let the Velox SQL writer omit the column rather than explicitly assigning SQL NULL, depending on that writer's update rules.

**External references**

- [Embarcadero DocWiki: `TField.Required`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Required) documents the standard nonblank requirement and null-post exception behavior.
- [Free Pascal: `TField.Required`](https://www.freepascal.org/docs-html/fcl/db/tfield.required.html) documents the compatible field requirement; the Velox explicit-SQL-null interpretation is product-specific.

<small>Created 2026-07-15</small>
