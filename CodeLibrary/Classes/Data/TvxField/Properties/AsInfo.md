---
title: AsInfo
description: Formats DisplayName plus AsString when read but writes the complete assigned text directly to AsString.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, display-name, information, asymmetric, string]
---

```Delphi
property AsInfo: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Field.AsInfo;
end;
```

### Usage

`AsInfo` formats DisplayName plus AsString when read but writes the complete assigned text directly to AsString.

**Asymmetric setter**

The setter is not an inverse parser. It writes the entire supplied string directly to `AsString`:

```Delphi
AsString := Value;
```

Assigning a value previously returned by the getter therefore attempts to store text such as `Customer code: ABC` in the field. It does not remove the label or colon and can corrupt string data or cause conversion failure on numeric/date fields. Treat `AsInfo` as read-only diagnostic formatting in scripts even though Velox scripting registers a setter.

Reading uses the field's normal string conversion. Assignment follows normal dataset edit, read-only, conversion and validation rules, changes only the current record and does not post or commit. Field labels may contain sensitive schema information; apply normal logging controls.

### Additional Technical Info
The `AsInfo` getter produces a labelled diagnostic string:

```Delphi
DisplayName + ': ' + AsString
```

`DisplayName` is normally the field's display label or field name. The value portion uses `AsString`, not `DisplayText`; display formatting or an `OnGetText` presentation can therefore differ from other UI output. A null value normally contributes an empty string, leaving the label and colon.

**External references**

- [Embarcadero DocWiki: `TField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField) documents field display metadata and `AsString` conversion behavior beneath this Velox formatter.

<small>Created 2026-07-15</small>
