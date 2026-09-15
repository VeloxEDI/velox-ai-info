---
title: ftCursor
description: Identifies an Oracle stored-procedure output cursor parameter rather than a normal field value.
sidebar_position: 95
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, oracle, cursor, parameter]
---

```Delphi
ftCursor = 22
```

### Example

```Delphi
function IsOutputCursor(DataType: TFieldType): Boolean;
begin
  Result := DataType = ftCursor;
end;
```

### Usage

`ftCursor` identifies an Oracle stored-procedure output cursor parameter rather than a normal field value.

### Additional Technical Info
`ftCursor` is ordinal 22 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Embarcadero defines it for an Oracle stored-procedure output cursor (`TParam` only). The installed default field-class table contains no ordinary field class for it.

The value is a result-set handle contract, not a numeric cursor position or a dataset row. The Oracle driver controls when the returned dataset becomes available, who owns it, whether it is forward-only and how long it remains valid relative to the command, transaction and connection.

Do not persist the ordinal as an external type code or assume the output can be read after closing its command/connection. Validate direction and provider support before execution, and fully process/close the cursor according to the calling API.

The example only compares metadata and was source-reviewed; no Oracle procedure, cursor, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; Oracle cursor parity is not implied.

<small>Created 2026-07-15</small>
