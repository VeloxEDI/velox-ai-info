---
title: "Report runtime and troubleshooting"
description: "Diagnose Report data linking, rendering, service-account output, warnings and irreversible delivery effects."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Report runtime, rendering error, email output, print output]
---

At runtime Velox links the source data module into the Report, configures output/print options and renders through ReportBuilder. File, print and email output can be externally visible before a later Flow failure and is not rolled back by database transaction finalisation.

| Symptom | Investigation |
| --- | --- |
| Fields/layout missing | Reopen after Definition changes; check dataview/pipeline and master/detail field links. |
| Cancelled with no data | Source criteria/parameters and **Print with no data**. |
| One output per record is wrong | Split setting, selected master view, output-name uniqueness and record count. |
| File path fails | Evaluated path/name and service-account create/write rights. |
| Printer differs from Designer | Printer installation/defaults/access on the service host/account. |
| Email uncertain | SMTP log/recipient/attachment evidence; do not resend until delivery state is reconciled. |
| Error appears as warning | **Ignore report errors** can downgrade applicable failures; clear it when output integrity must stop the Flow. |
| PDF appearance differs | Font availability/embedding, viewer and page/layout settings. |
| A scaled PDF image is a solid colour | Confirm the running Velox build includes the current scaled-image fix. In an older build, open the Report properties in the designer and clear **PDFSettings > ScaleImages** as a diagnostic; the image object's **Stretch** setting still controls its visual layout size. |
| Non-printer output opens a printer connection | Confirm the current Velox executable and Report configuration. Current Report creation and non-printer export defer physical-printer setup; only printer output should require the selected printer. |

Test mode is not a delivery sandbox for Reports. Use sanitised data and controlled recipients, printer and folders. If a retry can reproduce output, use a correlation-safe filename/message policy and reconcile the first attempt before replay. See [layout/output](layout-output-and-delivery.md), [status/logging](../../flows/runtime/status-and-logging.md) and [Execution Logs](../../../operate-and-troubleshoot/execution-logs.md).
