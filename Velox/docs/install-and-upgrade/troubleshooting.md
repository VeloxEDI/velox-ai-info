---
title: "Troubleshoot installation and upgrades"
description: "Diagnose Velox installation, service-start, database and post-upgrade failures safely."
sidebar_position: 90
classification: public
status: approved
owner: Cam Hart
keywords: [installation troubleshooting, upgrade failure, Velox service]
---

Start with the earliest failing layer. Preserve the first error and the environment state before retrying; repeated partial installs or upgrades can hide the original cause.

| Symptom | Likely causes | Safe diagnostic | Resolution and verification |
| --- | --- | --- | --- |
| Designer cannot load a system connection | Missing/invalid `Connections.json`, blank DisplayName, zero ConfigNum, unresolved database key or driver problem | Validate JSON and selected key; test database resolution under the interactive identity | Correct the profile/driver, reopen Designer and verify the intended environment |
| Service starts then stops | Missing `-c`/`-n`, database/schema unavailable, account lacks ProgramData/database rights | Inspect Windows service definition and startup/system logs without exposing credentials | Correct parameters/rights/schema, start once and verify process/status communication |
| API port does not listen | Port conflict, wrong service instance/key, listener startup failure | Check the configured port and owning process; review API Service startup log | Free/change the port, restart API Service and test a controlled REST Flow |
| Files/configuration disappeared after install | Environment-owned ProgramData was overwritten by defaults | Stop processing and compare secure backup to current files | Restore reviewed files, reapply only required release assets, then revalidate |
| Post-upgrade modules fail to load | Schema/version mismatch, missing dependency or module-stream conversion issue | Preserve the exact module/error and compare applied release steps | Stop services, correct/roll back using the release plan, then retest isolated modules |
| Flow succeeds but external delivery is missing | Outbound send is asynchronous | Inspect Transport Logs, attempts and next-attempt time | Correct the Transport/dependency and use the appropriate transport retry path |

Collect release/version, bitness, connection key (not secrets), service name/state/parameters, first error, database-update record, relevant Flow/Transport identifiers and a sanitised log excerpt. Continue with [service troubleshooting](../operate-and-troubleshoot/service-troubleshooting.md) for established installations.
