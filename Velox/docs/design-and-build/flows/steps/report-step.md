---
title: "Configure a Report step"
description: "Configure source data, output destination, format, target details, attachments and email options for a Flow Report step."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Report step, PDF, printer, email, output file]
---

A Report step opens its source Definition and renders a selected Report to a viewer, printer, file or email target. Report output is an external effect and is not undone by later database rollback.

## Settings

| Setting | Default | Effect |
| --- | --- | --- |
| **Report** | Empty reference | Report module to execute. |
| **Source Data** | None | Required Definition-backed source. |
| **Output destination** / `OutputDest` | Viewer | Viewer, printer, file or email. A service cannot use an interactive viewer as an unattended delivery design. |
| **Output type** / `OutputType` | PDF | Rendered content/output format. Confirm the exact options in the installed Designer and receiver contract. |
| **Output details** | Empty | Destination-specific value; may contain tags. Validate evaluated printer, file or email target. |
| **File details** | Empty | Additional file-output detail. Its exact format is output-path dependent; verify with a generated sample. |
| **Attachment** | Empty | Attachment configuration for applicable output. |
| **Miscellaneous** | Empty | Additional report option string. Use only with a source-verified deployment convention. |
| **BCC email** | Empty | Blind-copy recipients for email output. Treat addresses as governed personal/business data. |

## Test each destination separately

1. Select the [Report](../../transformations-output/reports/index.md) and compatible source.
2. Configure one controlled destination and keep the step out of automated execution.
3. Test empty/multiple records, pagination, long/non-ASCII data and output-name tags.
4. Verify the physical file, printer job or received message plus its log—not only Flow status.
5. Repeat after changing output type, template, runtime identity or destination host.

Printer availability, filesystem permissions and SMTP delivery depend on the service host/account. Test mode does not guarantee suppression of Report output. For REST execution, report handling can write to the API response stream, so response content/status must be tested end to end.
