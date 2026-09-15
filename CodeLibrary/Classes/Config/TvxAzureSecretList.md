---
title: TvxAzureSecretList
description: Implements AzureSecrets as a process-global lazy Key Vault lookup whose inherited indexer caches plaintext or Null results.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, azure-key-vault, secrets, cache]
---

```Delphi
TvxAzureSecretList = class(TvxVariableList)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var SecretVar: TvxVariable;
begin
  SecretVar := AzureSecrets['IntegrationApiKey'];
  if SecretVar <> nil then
    Value := not VarIsNull(SecretVar.Value)
  else
    Value := False;
  // Use the secret only at its authorised call site; never log it.
end;
```

### Usage

`TvxAzureSecretList` implements AzureSecrets as a shared across the Velox process Key Vault lookup on first access whose indexer caches plaintext or Null results.

**Security and performance**

Use only governed literal vault/secret identifiers. Unencoded dynamic text can alter the request path/host construction. Grant the configured identity only required `secrets/get` permission, treat `Null` as retrieval failure rather than an empty secret, and never put secret values in logs, errors, SQL, filenames or documentation.

Keep first access outside high-volume loops where practical. Cached lookup is linear in cached entry count; a miss is remote, blocking and potentially slow.

### Additional Technical Info
`TvxAzureSecretList` is the class behind the process-global [`AzureSecrets`](../../Variables/Config/AzureSecrets.md) variable. It inherits its script-visible default indexer and cache-management methods from [`TvxVariableList`](TvxVariableList.md); it declares no additional members.

Scripts do not construct or free it. The host creates one global list and binds it into every scripter.

**Inherited lookup and code format**

```Delphi
SecretVar := AzureSecrets['SecretName'];
SecretVar := AzureSecrets['VaultName:SecretName'];
```

The inherited default property searches cached variable codes case-insensitively. On a miss it creates a [`TvxVariable`](TvxVariable.md), invokes this class's Azure-specific value loader and adds the variable to the list.

`SecretName` uses the General Setup default Key Vault. `VaultName:SecretName` selects an explicit vault, splitting at the first colon. The native code does not trim or URL-encode either component.

**Request sequence**

For a cache miss, Velox:

1. reads the current Setup Azure client ID, decrypted secret and tenant;
2. configures Microsoft OAuth with scope `https://vault.azure.net/.default`;
3. sends GET to `https://<vault>.vault.azure.net/secrets/<secret>?api-version=7.4`;
4. on a successful HTTP response, parses JSON and reads its `value` string; and
5. stores the result in the newly cached variable.

No secret version segment is sent, so Key Vault returns the current/latest version according to the service API. The source hardcodes API version 7.4; changing Microsoft documentation versions does not change this product request.

If client ID is blank, Velox returns `Null` without sending. An unsuccessful response also produces `Null`. Caught authentication/network/JSON/program exceptions produce `Null`, log a general Key Vault warning to the Windows/event logger and do not propagate the original exception to the script.

**Cache behaviour and quirks**

- The inherited list lock remains held while a cache miss performs OAuth, DNS/TLS/HTTP and JSON work. One slow secret fetch blocks other AzureSecrets lookups/cache operations in that process.
- The variable is cached even when its Value is `Null`. A transient failure therefore becomes a sticky cached result and does not retry automatically.
- A nonblank default vault is cached separately after first use. Removing secret variables does not clear that default-vault field, so later Setup vault changes remain invisible until the Azure secret list itself is recreated/process restarts. When the Setup vault is blank, it is reread on later misses because the cache remains blank.
- A successful secret is held as plaintext in a normal, non-encrypted `TvxVariable` value in process memory. Key Vault rotation is invisible until explicit cache invalidation.
- Writing the returned variable changes only the local process cache; it never updates Key Vault.

Inherited `RemoveVariable(Code)` can force a later refetch of one code and `FreeAllVariables` clears all cached variables. Both are process-global destructive operations that can invalidate references held by other scripts. Coordinate them and never use them casually in record processing.

**Microsoft reference**

- [Azure Key Vault Get Secret REST API](https://learn.microsoft.com/en-us/rest/api/keyvault/secrets/get-secret/get-secret) — official request, OAuth scope, permission, version and response model; Velox's exact hardcoded URL/version remains as described above.

<small>Created 2026-07-15</small>
