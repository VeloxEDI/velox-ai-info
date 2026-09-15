---
title: DataSize
description: Returns the concrete field's native value-buffer size in bytes, which is an implementation measure rather than its display width or database character limit.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, datasize, buffer, bytes]
---

```Delphi
property DataSize: Integer read;
```

### Example

```Delphi
function NativeFieldBytes(const Data: TvxClientDataSet; const Name: string): Integer;
begin
  Result := Data.FieldByName(Name).DataSize;
end;
```

### Usage

Use `DataSize` for diagnostics that need the current field type's low-level value-buffer size in bytes. It is not the display width, maximum character count or database precision.

- Use the property for diagnostics and capacity awareness, not to infer maximum user characters or database precision.
- Do not allocate or decode raw record buffers in normal Velox scripts; the scripting surface does not provide a safe typed buffer contract.
- Re-read it after using a different field object/type rather than assuming all values of one database family share a size.

### Additional Technical Info
`DataSize` reports the byte count used by the concrete field's native data representation.

#### Source-backed behaviour

Base `TField.GetDataSize` returns zero; descendants override it. Fixed-width integer fields return their native storage size, while string, byte, date/time, BCD and other descendants calculate sizes according to their buffer representation. The result participates in low-level `GetFieldData`, conversion and calculated-field buffer handling.

It is not equivalent to [`Size`](Size.md): `Size` is schema/type metadata for variable-size field types. It is also unrelated to [`DisplayWidth`](DisplayWidth.md), which is presentation metadata. Internal buffer sizes can include terminators, length markers or binary structures and can differ between Delphi/FPC implementations and field descendants.

#### Operational guidance

- Use the property for diagnostics and capacity awareness, not to infer maximum user characters or database precision.
- Do not allocate or decode raw record buffers in normal Velox scripts; the scripting surface does not provide a safe typed buffer contract.
- Re-read it after using a different field object/type rather than assuming all values of one database family share a size.

#### Official RTL references

- [Embarcadero: TField.DataSize](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.DataSize)
- [Free Pascal: TField.DataSize](https://www.freepascal.org/docs-html/current/fcl/db/tfield.datasize.html)

<small>Created 2026-07-15</small>
