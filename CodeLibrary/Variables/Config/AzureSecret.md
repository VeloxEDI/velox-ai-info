---
title: "AzureSecret"
description: "Exposes the decrypted General Setup Azure OAuth client secret as a compile-time string constant."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - azure
  - secret
---

```Delphi
AzureSecret = <hidden string value>
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  {Check availability without returning or logging the credential.}
  Value := AzureSecret <> '';
end;
```

### Usage

`AzureSecret` exposes the decrypted General Setup Azure OAuth client secret as a string value captured when the script is compiled.

**Lifecycle and security**

- The value is a value captured when the script is compiled. Rotating General Setup credentials does not alter an already compiled script instance.
- Plaintext can remain in memory and may be copied into Variants, strings, logs, exceptions or output if a script does so.
- The constant is shared capability, not proof that authentication succeeded. It has no tenant, client-ID or scope information by itself.
- Never return it as `Value`, write it to logs/files/datasets, include it in URLs, or compare it with user-supplied text.
- Prefer [`AzureSecrets`](AzureSecrets.md) for retrieving the particular application secret a flow needs. Even then, minimize lifetime and disclosure.

The constant is immutable in script code. It can be empty when General Setup has no Azure secret. Reading it performs no network or database I/O after compilation and raises no error.

### Additional Technical Info
`AzureSecret` is the OAuth client secret configured in General Setup. It is a string constant in each compiled script, not an Azure Key Vault lookup and not the same as [`AzureSecrets`](AzureSecrets.md).

**Effective declaration**

Velox deliberately hides the actual value in the Code Library declaration. During script compilation, `TvxScripter.RegisterConstants` locks the live Setup module, reads `Setup.AzureSecret` (which decrypts the stored field outside component streaming), and passes the plaintext to the PascalScript compiler as a constant.

**Related entries**

- [`Setup`](Setup.md) exposes a safe subset of General Setup properties but does not expose `AzureSecret` as a script property.
- [`AzureSecrets`](AzureSecrets.md) retrieves named Key Vault values through the configured OAuth credential.

<small>Created 2026-07-19</small>
