---
title: "GetComputerNameExDomain"
description: "Returns the DNS domain name assigned to the local Windows computer or an empty string on failure."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - dns-domain
  - windows
---

```Delphi
Function GetComputerNameExDomain : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetComputerNameExDomain;
end;
```

### Usage

`GetComputerNameExDomain` returns the DNS domain name assigned to the local Windows computer or an empty string on failure.

### Additional Technical Info
`GetComputerNameExDomain` returns the Windows `ComputerNameDnsDomain` value for the local computer.

The product allocates a fixed 1,024-character API buffer and calls `GetComputerNameEx` on every invocation. On success it returns the number of characters reported by Windows; on any failure it silently returns `''` without preserving or exposing the OS error. There is no retry if a larger buffer were required.

This is the DNS domain assigned to the computer, not the current user's account domain and not necessarily an Active Directory authorization boundary. On a cluster node, Windows can return the cluster virtual server's domain for this non-physical name format. An empty value can mean no usable domain or an API failure; the function does not distinguish those cases.

Treat this value as diagnostic/configuration context. Do not use it alone to authenticate a caller, choose a credential, authorize a flow or build an unvalidated URL/SQL identifier.

**Related entries and official reference**

- [`GetComputerNameExHostName`](GetComputerNameExHostName.md) returns the DNS host component.
- [`GetComputerNameExFQName`](GetComputerNameExFQName.md) returns the combined fully qualified DNS name.
- [Microsoft: GetComputerNameExW](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getcomputernameexw)

<small>Created 2026-07-19</small>
