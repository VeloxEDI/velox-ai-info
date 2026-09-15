---
title: "Configure HTTP Transports"
description: "Configure verified inbound and outbound HTTP exchange"
sidebar_position: 10
slug: /transports/http-transports
classification: public
status: approved
owner: Cam Hart
keywords: ["http", "https", "transport"]
---

Configure an HTTP Transport to retrieve content from, or send content to, a tested web endpoint.

## Scope

Both directions provide URL, method, authentication, headers, protocol version, redirect handling, connection/read timeouts, SSL settings and an optional custom response script. Outbound configuration additionally supplies content name and encoding.

## Settings

| Setting | Effect and boundary |
| --- | --- |
| **URL** and **Method** | Identify the target operation. Confirm the complete path, query handling and method with the endpoint owner. |
| **Authentication Type** | Supports the types currently offered by Designer, including username/password, bearer/Windows and applicable OAuth fields. Availability does not prove provider compatibility. |
| **Send authentication on first attempt** | Sends credentials without waiting for a challenge. Enable only when required and only over an approved protected connection. |
| **Headers** | Adds request headers. Do not log or document live tokens, cookies or secrets. |
| **Handle redirects** / **Follow "Location" response** | Controls redirect behaviour. Verify the final host and prevent credential forwarding outside the approved boundary. |
| **Connect Timeout** / **Read Timeout** | Bounds network waits; a timeout does not prove the receiver did not process a request. |
| **SSL Settings** | Controls certificate/TLS behaviour. Apply the security policy and do not disable verification merely to pass a test. |
| **Custom Response Script** / **Script active** | Processes the response using the configured script. Compile and test it with sanitised responses. |

## Controlled setup

1. Create the inbound or outbound HTTP Transport and leave **Active** clear.
2. Enter a non-production HTTPS URL, method and approved authentication configuration.
3. Add only required headers and set conservative timeouts/redirect handling.
4. For outbound use, configure content name and encoding to match the validated API contract.
5. Use **Test with...** and a sanitised payload. Inspect status, response and communication log without exposing secrets.
6. Verify the receiving system independently, then save and link the Transport to a controlled Flow.

## Constraints and failure behaviour

- HTTP success status does not by itself prove the business transaction completed.
- Retrying after a timeout or ambiguous response can duplicate a non-idempotent request.
- Redirects, custom headers and response scripts can change the security/data boundary.
- Supported methods, authentication providers, TLS versions and payload encodings must be tested for the deployed version.

## Related references

- [Configure HTTP input](http-input.md)
- [Configure HTTP output](http-output.md)
- [Test and operate Transports](../operate-transports.md)
- [File and Transport troubleshooting](../../../operate-and-troubleshoot/file-and-transport-troubleshooting.md)
- [Security boundaries](../../../technical-reference/security-boundaries.md)
