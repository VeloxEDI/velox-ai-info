---
title: "AzureSecrets"
description: "Provides the shared lazy cache used to retrieve named secrets from Azure Key Vault."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - azure-key-vault
  - secrets
---

```Delphi
AzureSecrets: TvxAzureSecretList
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var SecretVar: TvxVariable;
begin
  SecretVar := AzureSecrets['IntegrationApiKey'];
  Value := not VarIsNull(SecretVar.Value);
  {Use SecretVar.AsString only at the authenticated call site; do not log it.}
end;
```

### Usage

`AzureSecrets` provides the shared lazy cache used to retrieve named secrets from Azure Key Vault.

**Code format and request**

- `SecretName` uses the default key vault from General Setup.
- `VaultName:SecretName` selects an explicit vault. Velox splits at the first colon; an empty prefix also falls back to the default vault.

On the first case-insensitive lookup of a code, Velox creates a cached variable. It constructs a `TvxHttp` client with Microsoft OAuth, current Setup client ID/secret/tenant and scope `https://vault.azure.net/.default`, then sends GET to `https://<vault>.vault.azure.net/secrets/<name>?api-version=7.4`. A successful JSON response supplies its `value` string.

Vault and secret text is inserted into the URL without URL encoding or character validation. Use only governed literal identifiers; never construct a code from external input.

**Caching, errors and ownership**

- The returned `TvxVariable` and plaintext are cached process-wide after first access. Key Vault rotation is not visible until that cache entry is removed or all variables are cleared.
- A non-empty default vault name is cached after it is first read. If Setup returns an empty name, the field stays empty and Setup is checked again on a later lookup. Once a non-empty name has been cached, later Setup changes do not refresh it.
- Missing client ID, unsuccessful HTTP status, absent data or caught exceptions produce `Null`. Exceptions are logged as a general Key Vault warning and are not re-raised.
- The shared list owns cached variables. Never free the list or a returned variable. Avoid `FreeAllVariables`; it can invalidate references used by other scripts. `RemoveVariable(code)` is still global cache invalidation and requires coordination.
- Writing a cached variable changes only memory; it does not update Key Vault.

This lookup can perform authentication, DNS/TLS/network I/O and JSON parsing. Keep it outside record loops where possible and treat `Null` as retrieval failure, not as an empty secret.

### Additional Technical Info
`AzureSecrets` is the host-owned process-global `TvxAzureSecretList`. Its inherited default `Variable` property makes `AzureSecrets['name']` return a `TvxVariable` whose value is fetched lazily from Azure Key Vault.

**Related class references**

- [`TvxAzureSecretList`](../../Classes/Config/TvxAzureSecretList.md)
- [`TvxVariableList`](../../Classes/Config/TvxVariableList.md)

<small>Created 2026-07-19</small>
