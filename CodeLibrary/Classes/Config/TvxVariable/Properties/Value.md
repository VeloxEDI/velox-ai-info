---
title: Value
description: Gets or sets the canonical Variant value under lock, applying optional validation and native encrypted-string storage.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, variable, variant, encrypted]
---

```Delphi
property Value: Variant read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Locals['WorkingValue'].Value := 42;
  Value := Locals['WorkingValue'].Value;
end;
```

### Usage

Gets or sets the canonical Variant value under lock, applying optional validation and Velox encrypted-string storage.

### Additional Technical Info
`Value` is the canonical read/write Variant property. Each operation holds the variable's re-entrant monitor and returns/assigns a scalar Variant snapshot.

On write, native `ValidateValue` (normally false for Globals/Locals) can validate by ParamType and raise on invalid non-Null input. If Encrypted is false, the Variant is stored directly. If Encrypted is true, normal writes convert to string and store `EncryptString(...)`; component reading/loading instead accepts the raw persisted ciphertext.

On read, non-encrypted values are returned directly. Encrypted values normally decrypt `VarToStr(FValue)` and return plaintext as a string; component-writing state returns raw ciphertext for persistence.

**Quirks and safety**

- Encryption is string-based and loses the original Variant subtype on normal read.
- Typed Boolean/date/numeric aliases bypass this setter/getter and therefore bypass validation/encryption or read ciphertext. String/SQL/Info aliases do use Value.
- Validation and encryption occur while holding the monitor and can raise; failed assignment leaves the prior value unless a called helper has side effects.
- The property is thread-safe as one scalar operation, but sequences across Value, Code and Data are not atomic.
- Shared Globals/Settings/Azure-derived variables can contain sensitive data. Never log Value/AsInfo and understand the owning list's persistence/cache lifetime.

Variant-to-string reference used by encrypted storage: [Delphi VarToStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr), [Free Pascal VarToStr](https://www.freepascal.org/docs-html/rtl/variants/vartostr.html).

<small>Created 2026-07-15</small>
