---
title: DisplayName
description: Returns the field's effective human-facing name, choosing an explicit DisplayLabel when present and otherwise the technical FieldName.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, displayname, label, errors]
---

```Delphi
property DisplayName: string read;
```

### Example

```Delphi
function FieldCaption(const Data: TvxClientDataSet; const Name: string): string;
begin
  Result := Data.FieldByName(Name).DisplayName;
end;
```

### Usage

`DisplayName` returns the field's effective human-facing name, choosing an explicit DisplayLabel when present and otherwise the technical FieldName.

- Use `FieldName` for mappings, serialisation and stable technical identity.
- Use this property for diagnostics and user messages, preferably alongside `FieldName` when troubleshooting.
- Do not assume labels are unique across fields or stable across configuration changes.

### Additional Technical Info
`DisplayName` is the effective presentation name used by Delphi field infrastructure, including many field-related exception messages.

#### Source-backed behaviour

The implementation returns the stored `DisplayLabel` when it is non-empty; otherwise it returns [`FieldName`](FieldName.md). There is no independent stored display-name value and no formatting or localization step in the getter. Reading is constant-time and normally side-effect free.

Changing [`DisplayLabel`](DisplayLabel.md) or renaming an inactive field therefore changes this result. Native access, conversion and validation errors use it for user-facing field identification, so logs may contain a friendly label rather than the programmatic lookup name. It is not accepted by `FieldByName` unless it also happens to equal the actual field name.

#### Official RTL references

- [Embarcadero: TField.DisplayName](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DisplayName)
- [Free Pascal: TField.DisplayName](https://www.freepascal.org/docs-html/current/fcl/db/tfield.displayname.html)

<small>Created 2026-07-15</small>
