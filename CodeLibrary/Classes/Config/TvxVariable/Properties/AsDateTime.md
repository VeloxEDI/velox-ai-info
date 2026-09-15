---
title: AsDateTime
description: Converts the raw Variant to TDateTime on read and stores a varDate Variant on write.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, datetime, variant]
---

```Delphi
property AsDateTime: TDateTime read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['RunAt'].AsDateTime := Now;
  Value := Locals['RunAt'].AsDateTime;
end;
```

### Usage

`AsDateTime` converts the raw Variant to TDateTime on read and stores a varDate Variant on write.

### Additional Technical Info
`AsDateTime` reads with Delphi `VarToDateTime(FValue)` and writes with `VarFromDateTime` under the variable monitor.

Failed reads, including Null or nonconvertible text, propagate the Delphi Variant conversion exception; Velox does not catch it here. Interpretation of convertible text follows the runtime/locale conversion rules rather than a Velox format string.

The setter stores a `varDate` Variant directly. It bypasses Value validation and encryption. Both directions use raw `FValue`, so this alias is unsuitable for an encrypted variable whose normal stored representation is ciphertext.

Official references: [Delphi VarToDateTime](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToDateTime), [Free Pascal VarToDateTime](https://www.freepascal.org/docs-html/rtl/variants/vartodatetime.html), [Delphi VarFromDateTime](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarFromDateTime), [Free Pascal VarFromDateTime](https://www.freepascal.org/docs-html/rtl/variants/varfromdatetime.html). Free Pascal is a compatibility reference; current Delphi behaviour is authoritative for Velox.

<small>Created 2026-07-15</small>
