---
title: "Troubleshoot the VxData portal"
description: "Diagnose portal sign-in, authorisation, transaction, save and Velox Flow-action failures."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [VxData portal troubleshooting, user party, Velox Flow mapping, save error]
---

Record the portal environment/URL, local and UTC timestamp, signed-in user (not password), role, selected party/transaction identifier, action code and visible status/error before refreshing or repeating an action.

| Symptom | Checks | Safe recovery |
| --- | --- | --- |
| Cannot sign in/session expires | Correct environment, account state, authentication configuration, browser time/cookies and portal logs | Use approved account recovery; do not share credentials/cookies |
| Administration/Dashboard forbidden | Current role claim and `Administrator` assignment | Correct governed role and sign in again; do not bypass controller access |
| Transaction/list empty | Date/status filters/cookies, user-party assignments, application/owner relationships and expected VxData record | Correct filter or assignment; never create a duplicate merely because search is empty |
| Record is read-only/unauthorised | Party ownership, user-party assignment and administrator versus ordinary user behaviour | Correct ownership/assignment or use governed support correction |
| Save fails | Validation message, concurrency/revision/current record, required reference data and database/application logs | Reload current state, reconcile changes and save once; avoid repeated submits |
| Flow entry says not found | Mapping Action FID, connected VxConfig context, Flow active/existing state | Correct mapping and retest in controlled context |
| Flow/print returns error or 503 | Portal-to-Velox host/port, Velox API Service, REST Flow log, timeout and output content type | Preserve both portal and Flow evidence; reconcile effects before repeat |
| Portal says success but partner has nothing | Flow log, queued Transport record and receiver acknowledgement | Diagnose Transport separately; do not repeat portal action blindly |

The current Flow bridge can map connectivity failure to a 503-style response and uses a three-minute application client timeout. A timeout does not prove the Velox Flow or external system did nothing. Check [Execution Logs](../operate-and-troubleshoot/execution-logs.md), [Transport Logs](../operate-and-troubleshoot/transport-logs.md) and the target system before retrying.

For escalation include portal build/environment, user role/party (sanitised), transaction/action code, timestamps, HTTP/status message, relevant server log and Velox Flow/Transport identifiers. Remove session cookies, credentials and business payloads. See the [incident evidence checklist](../operate-and-troubleshoot/incident-evidence-checklist.md).
