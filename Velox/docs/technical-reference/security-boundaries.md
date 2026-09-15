---
title: "Velox security boundaries"
description: "Understand identity, credentials, certificates and deployment responsibilities"
sidebar_position: 70
slug: /advanced/security-boundaries
classification: public
status: approved
owner: Cam Hart
keywords: [security, credentials, certificates]
---

Velox security is shared across Windows identities, databases, configuration, files/certificates, Transports, scripts and deployment gateways. A successful connection test, encrypted stored password or security declaration is not a security approval.

## Trust boundaries and controls

| Boundary | Required treatment |
| --- | --- |
| Designer versus services | Designer runs as the interactive user; services run as assigned Windows identities. Test filesystem/database/network access as the real host identity and use least privilege. |
| Configuration and secrets | Stored passwords may be product-encrypted, but database/ProgramData access remains sensitive. Restrict backups, `.CFG` files and Variables; use managed rotation and avoid secrets in ordinary scripts/logs. |
| Database/VxData | Grant only required schema/data operations, protect connections in transit according to deployment policy and audit privileged/admin changes. |
| Files and certificates | Protect ProgramData, runtime shares, `Certificate\Private`, keys and portal configuration/cookies. Validate ownership, expiry, chain, hostname and file ACLs. |
| SFTP/SSH | Verify host keys out of band; protect private keys/passphrases. Do not accept a changed host key without investigation. |
| Transport protocols | Authentication/TLS varies by protocol/library. Verify peer/certificate/hostname behaviour and test negotiated security; an option label is not certification. |
| APIs | Velox API Service is not the complete public authentication/TLS boundary. Use an approved gateway, restrict direct access, strip untrusted identity headers and enforce method/path/body/rate limits. |
| VxData portal | Protect browser TLS/session/authentication, role/user-party assignment, portal-to-Velox traffic and administrator/reference-data changes. |
| Scripts/commands/SQL | Execute with runtime identity and can read data or cause arbitrary configured side effects. Review code, constrain inputs/permissions and block injection paths. |
| Logs/diagnostics | SQL, HTTP, file, Transport and exception capture can contain secrets/business data. Enable narrowly, sanitise and retain under policy. |

## Product-specific caveats

- Reversible encryption used for stored credentials protects representation, not an attacker with application/configuration access.
- The reviewed REST dispatcher does not centrally enforce **Allow anonymous**, and generated OpenAPI API-key/bearer schemes do not activate authentication.
- Some certificate/verification callbacks and protocol-version labels have implementation limitations documented on the relevant Transport pages; prove the exact deployed handshake.
- The VxData portal's current internal Velox service client is configured independently from browser TLS; protect that internal network path and validate the deployed architecture.

Do not publish credentials, private keys, customer data or security-sensitive topology. Escalate any uncertain TLS/authentication behaviour before production use.

- [Service accounts](../install-and-upgrade/plan/service-accounts.md)
- [Transport concepts](../design-and-build/transports/transport-concepts.md)
- [API deployment](../design-and-build/apis-and-openapi/api-deployment.md)
- [Incident evidence](../operate-and-troubleshoot/incident-evidence-checklist.md)
