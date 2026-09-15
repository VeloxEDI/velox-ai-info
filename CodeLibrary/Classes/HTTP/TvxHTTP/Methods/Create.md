---
title: Create
description: Constructs a separate caller-owned HTTP client around a required Velox log, new Indy client, streams, response facade and cookie manager.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, constructor, ownership, lifetime]
---

```Delphi
constructor Create(aLog: TvxLog);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var Client: TvxHTTP;
begin
  Client := TvxHTTP.Create(Map.Log);
  try
    Client.Get('https://api.example.invalid/health');
    Value := Client.Response.ResponseCode;
  finally
    Client.Free;
  end;
end;
```

### Usage

`Create` constructs a separate caller-owned HTTP client around a required Velox log, new Velox client, streams, response facade and cookie manager.

### Additional Technical Info
`Create` constructs a new independent [`TvxHTTP`](../../TvxHTTP.md) object. The caller owns the returned object and must call `Free`, including when a later request raises. This differs from the [`Http`](../../../../Variables/Helpers/Http.md) helper, whose returned object is owned by the scripter/host and must not be freed by script code.

`aLog` is retained by reference; it is not cloned or owned. The client uses it for HTTP wire logging, authentication failures and caught header/OAuth errors. Passing `nil` can therefore cause an access violation on those paths. The supplied log must remain alive for the client's complete lifetime.

Construction allocates:

- one Indy HTTP client;
- a fresh per-client cookie manager;
- an empty stored-header `TStringList`;
- an empty pending-request `TMemoryStream`; and
- a [`TvxHTTPResponse`](../../TvxHTTPResponse.md) facade with its own response-content stream.

It selects HTTP/1.1, redirects, a 15-second connection timeout, automatic SSL type, no authentication, automatic OAuth grant selection, a Velox-compatible user agent and disabled header folding. The read timeout remains Indy's default until assigned.

Local proxy, intercept and SSL objects are created lazily on the first request, not by the constructor. That SSL path leaves peer verification mode empty and assigns a callback that would accept failed checks; direct construction does not improve certificate verification.

Destruction releases the response and request streams, stored headers, locally created intercept/SSL objects, the per-client cookie manager, the Indy client and any OAuth authenticator. Do not free the log passed in `aLog` as part of the client cleanup.

**External references**

- [Embarcadero DocWiki: `TObject.Free`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.TObject.Free)
- [Embarcadero DocWiki: `TMemoryStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TMemoryStream)
- [Free Pascal: `TObject.Free`](https://www.freepascal.org/docs-html/rtl/system/tobject.free.html)

<small>Created 2026-07-15</small>
