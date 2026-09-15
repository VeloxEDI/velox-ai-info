---
title: "VeloxWebAdmin"
description: "Contains a compile-time snapshot of the configured Velox Web HTTPS base URL."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - velox-web
  - url
---

```Delphi
VeloxWebAdmin = <configured HTTPS base URL>
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := VeloxWebAdmin + 'health';
end;
```

### Usage

`VeloxWebAdmin` contains a value captured when the script is compiled of the configured Velox Web HTTPS base URL.

**Lifecycle and safety**

- The value is immutable for the compiled script. Domain/port changes in General Setup affect later compilation, not the existing constant.
- No DNS, TLS, certificate, reachability or authentication check occurs when the constant is read.
- Append only controlled relative paths. A leading slash can alter the intended URL path semantics, and external input can create SSRF/path/query risks when passed to an HTTP client.
- Treat the configured endpoint as location metadata, not proof that a caller or script is authorized.

[`Setup.VeloxWebUrl`](Setup.md) computes the live value when current configuration rather than compilation-time stability is required.

### Additional Technical Info
`VeloxWebAdmin` is the configured Velox Web base URL captured when the script is compiled.

**Effective declaration**

The generated index embeds the URL from the machine on which documentation was generated; public documentation intentionally redacts that environment-specific host. Product source defines the actual contract: `RegisterConstants` locks Setup and copies `lSetup.VeloxWebUrl` into a string constant.

`TvxSetup.GetVeloxWebUrl` always formats `https://<VeloxWebDomain>:<VeloxWebPort>/`. It includes the port and trailing slash, even when the port is the HTTPS default. Despite the constant name, the value contains no automatic `/admin` path and grants no administrative permission.

<small>Created 2026-07-19</small>
