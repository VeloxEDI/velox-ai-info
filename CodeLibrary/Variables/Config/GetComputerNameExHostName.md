---
title: "GetComputerNameExHostName"
description: "Returns the DNS host name of the local Windows computer or an empty string on failure."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - hostname
  - windows
---

```Delphi
Function GetComputerNameExHostName : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetComputerNameExHostName;
end;
```

### Usage

`GetComputerNameExHostName` returns the DNS host name of the local Windows computer or an empty string on failure.

### Additional Technical Info
`GetComputerNameExHostName` returns the local computer's Windows `ComputerNameDnsHostname` value.

This is the DNS host component, not explicitly the legacy NetBIOS name. The product invokes `GetComputerNameEx` with a fixed 1,024-character buffer for every call. On success it trims the managed string to Windows' reported character count; on failure it returns `''` without raising or exposing the OS error.

Windows can return a cluster virtual server name for this non-physical format on a cluster node. The value can change after computer-name configuration and restart. It is not resolved or tested for network reachability.

Use it for diagnostics and governed naming conventions, not as proof of machine identity. Do not authorize behavior, select secrets or construct unvalidated paths/URLs solely from this value. An empty string must be handled explicitly.

**Related entries and official reference**

- [`GetComputerNameExDomain`](GetComputerNameExDomain.md) returns the DNS domain.
- [`GetComputerNameExFQName`](GetComputerNameExFQName.md) returns the combined name.
- [Microsoft: GetComputerNameExW](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-getcomputernameexw)

<small>Created 2026-07-19</small>
