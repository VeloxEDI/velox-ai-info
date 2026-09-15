---
title: "GetComputerNameExFQName"
description: "Returns the fully qualified DNS name of the local Windows computer or an empty string on failure."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - fqdn
  - windows
---

```Delphi
Function GetComputerNameExFQName : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetComputerNameExFQName;
end;
```

### Usage

`GetComputerNameExFQName` returns the fully qualified DNS name of the local Windows computer or an empty string on failure.

### Additional Technical Info
`GetComputerNameExFQName` returns Windows' `ComputerNameDnsFullyQualified` value, normally in `host.domain` form. `FQName` is the exact public Velox identifier spelling even though the common abbreviation is FQDN.

Each call allocates a fixed buffer and invokes `GetComputerNameEx`. Success returns the reported characters; failure returns `''` silently. The function does not cache, perform DNS resolution, verify that the name is reachable, or distinguish an unjoined machine from an OS/API error.

For a cluster node, this name format can identify the cluster virtual server rather than the physical node. If physical-node identity matters, this helper is not sufficient. DNS names are case-insensitive and can change after system configuration/restart.

Use the result for logging, endpoint composition under trusted configuration, or diagnostics. It is not authentication, authorization, a certificate-name validation result or a guaranteed globally reachable address. Validate an empty result before concatenation.

**Related entries and official reference**

- [`GetComputerNameExHostName`](GetComputerNameExHostName.md) and [`GetComputerNameExDomain`](GetComputerNameExDomain.md) expose the component formats.
- [Microsoft: GetComputerNameExW](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getcomputernameexw)

<small>Created 2026-07-19</small>
