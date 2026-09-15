---
title: "Validate and recover after an upgrade"
description: "Verify Velox configuration, services, Flows and delivery after an upgrade and make a controlled recovery decision."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [post-upgrade validation, Velox recovery, rollback]
---

Validate from infrastructure through end-to-end business effect. A running Windows service is only the first checkpoint.

## Validation sequence

1. Confirm expected binaries, version/bitness and ProgramData assets.
2. Open Designer with the intended connection key and confirm the test/production context, General Setup and module tree load without conversion errors.
3. Confirm VxConfig/VxData access, representative DB/File Connections and required schemas/templates.
4. Confirm Velox Service and API Service process/status communication. Restart the API Service after endpoint configuration changes.
5. Run a controlled non-destructive Flow. Inspect its final Flow Log, database/file/report output and any linked Flow result.
6. If the Flow creates outbound Transport work, inspect the later Transport Log until sent or failed; Flow success alone does not prove delivery.
7. Validate a schedule, file monitor and REST Flow only when those capabilities are in deployment scope.
8. Re-enable triggers/traffic gradually and monitor errors, queue growth, latency and external acknowledgements.

## Recovery decision

| Condition | Action |
| --- | --- |
| Documentation/UI issue with healthy processing | Record and correct the documented path; do not roll back product state solely for a wording issue |
| Isolated configuration incompatibility with a reversible correction | Restore the reviewed module/configuration value, reload/restart the affected runtime and repeat the focused test |
| Database schema/update failure | Stop services and use the database-owner-approved restoration plan before writes continue |
| Binary/runtime incompatibility | Stop services, restore the previous approved package and matching database/runtime state |
| Uncertain partial processing | Preserve logs/files/database evidence and reconcile side effects before rerunning or restoring |

After recovery, repeat the full validation sequence. Record which state was restored, what processing occurred during the attempt and the final go/no-go decision.
