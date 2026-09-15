---
title: "Report layout, output and delivery"
description: "Configure Report data/layout properties and Flow viewer, printer, file, email or REST output."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Report layout, PDF, email, printer, Embed fonts]
---

The Report module owns its source Definition and layout/runtime error choices. The Flow Report step owns the concrete output destination and format for a run.

## Report module properties

| Setting | New-Report default | Effect |
| --- | --- | --- |
| **Source type / Definition** | None | Data Definition linked into the ReportBuilder report/pipelines. |
| **Print with no data** / `NoDataPrint` | Selected | Allows applicable static/report content when no detail data exists. |
| **Split report** | Cleared | Produces an individual report for each applicable master record. Verify file naming and recipient effects for multiple outputs. |
| **Ignore report errors** | Cleared | Converts applicable report errors to warning behaviour. Enable only if incomplete output is explicitly safe. |
| **Embed fonts in PDF** | Cleared | Improves PDF portability but increases output size and depends on font embedding permissions/availability. |

## Flow output properties

The [Report step](../../flows/steps/report-step.md) selects viewer, printer, file or email; output type defaults to PDF. Supported Designer types include PDF, HTML, PNG, JPEG, BMP, XLSX, XLS and RTF. A legacy XHTML value is converted to HTML during loading. Output details, file details, attachment, miscellaneous/subject and BCC fields can contain evaluated tags and must be tested for the selected destination.

Viewer output is interactive and unsuitable as an unattended service destination. Printer queues, output folders and fonts must be available to the runtime service account. Email requires the configured SMTP boundary and approved recipients. REST execution can stream Report output into the API response.

Current Velox defers physical-printer setup when creating a Report and when producing non-printer output. The printer list in a Flow Report step is loaded when **Printer** is selected as the output destination. PDF, file, email and REST output should therefore not require access to the default printer.

## Use variables in Report code

ReportBuilder code in the main Report and child Reports can access Velox settings, globals, Flow locals and configured Variable Groups through `Settings`, `Globals`, `Locals` and `Variables`.

For a configured Variable Group, use its group code without the stored `V_` prefix:

```delphi
Value := Variables['MyGroup']['MyVariable'].AsString;
```

Use the exact group and variable codes shown by Designer. Test the expression in the owning Report and Flow context because `Locals` depends on the current Flow execution.

## Layout verification

Test empty/one/many master/detail records, pagination, totals, long/non-ASCII content, Report code variable access, embedded fonts, every output type used, collision-safe filenames, multiple split outputs and the actual service account. Open generated files with an independent reader and verify recipient/printer delivery separately.
