---
title: HTTP
description: Live API request and response objects plus outbound HTTP helpers exposed to Velox scripts.
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, http, api, request, response]
---

The HTTP branch contains three distinct kinds of object: the inbound [`TvxAPIRequest`](HTTP/TvxAPIRequest.md), the paired [`TvxAPIResponse`](HTTP/TvxAPIResponse.md), and the outbound [`TvxHTTP`](HTTP/TvxHTTP.md) client with its [`TvxHTTPResponse`](HTTP/TvxHTTPResponse.md). They do not share ownership or lifecycle rules merely because they all carry HTTP data.

## Inbound API objects

[`Request`](../Variables/Helpers/Request.md) and [`Response`](../Variables/Helpers/Response.md) expose the live objects assigned to the current Velox action by an API/web execution. The web thread waits while the action executes, but the objects remain host-owned. Test each helper for `nil`, use it only during that synchronous execution, and never construct, free, cache or share the returned object.

Request headers, target information, query values, cookies, body bytes and network addresses are untrusted caller input. A property being present does not authenticate the caller or prove that an intermediary preserved it. Treat authorization and cookie values as secrets, enforce endpoint/body limits before expensive processing, and validate every business value explicitly.

## Outbound HTTP objects

The `HTTP` helper and manually constructed HTTP objects initiate outbound requests under the Velox process identity and network environment. They have separate configuration, mutable state, response ownership and error behavior documented on their class/member pages. Do not confuse an outbound response with the current inbound `Response` object.

## Important boundaries

- HTTP properties expose the current implementation's representation, not a canonicalised security record.
- Header names are case-insensitive at protocol level, but individual bridge mappings can select, strip or transform a value and can contain legacy defects.
- Request/response streams are mutable object references. Reading or changing a stream can affect another consumer of the same live execution.
- Whole-body string/byte helpers allocate in memory. Apply trusted maximum sizes before using them with externally controlled requests.
- Content type, content encoding and character encoding are independent. A media-type property does not decompress a coded body or prove that its bytes match the declared format.
- Objects are not documented as thread-safe. Do not retain them for asynchronous work.

## External references

- [Embarcadero DocWiki: `Web.HTTPApp.TWebRequest`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9112: HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112)
