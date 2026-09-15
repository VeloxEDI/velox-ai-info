---
title: HTTPMethod
description: Maps the effective Indy command to a Velox enum, collapsing OPTIONS, TRACE and custom methods to hmAny.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, method, enum, routing]
---

```Delphi
property HTTPMethod: TvxHTTPMethod read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.HTTPMethod = hmPost) then
    Value := 'POST'
  else
    Value := '';
end;
```

### Usage

`HTTPMethod` maps the effective Velox command to a Velox enum, collapsing OPTIONS, TRACE and custom methods to hmAny.

### Additional Technical Info
`HTTPMethod` maps WebBroker's `MethodType`, which was calculated from the effective [`Method`](Method.md) during native request construction:

| Effective text | Result |
|---|---|
| `GET` | `hmGet` |
| `PUT` | `hmPut` |
| `POST` | `hmPost` |
| `HEAD` | `hmHead` |
| `DELETE` | `hmDelete` |
| `PATCH` | `hmPatch` |
| anything else | `hmAny` |

Although [`TvxHTTPMethod`](../../../../Types/Enumerations/TvxHTTPMethod.md) also declares `hmOptions`, `hmTrace` and `hmCustom`, this getter never returns them. `OPTIONS`, `TRACE`, extension methods and malformed/empty commands all collapse to `hmAny`, so use `Method` when exact method identity matters.

For POST, Indy can replace the command from method-override headers before WebBroker calculates `MethodType`; both properties then describe the override rather than the original request-line token. Method selection is security-sensitive. Let endpoint routing constrain supported methods, reject unexpected values explicitly, and do not treat `hmAny` as permission to run any operation.

The property is read-only and has no dispatch side effect. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `Web.HTTPApp.TMethodType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TMethodType)
- [RFC 9110 section 9.1: Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.1)

<small>Created 2026-07-15</small>
