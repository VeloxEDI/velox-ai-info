---
title: "Configure Reports"
description: "Design and produce verified Velox Report outputs"
sidebar_position: 20
slug: /transform-output/reports
classification: public
status: approved
owner: Cam Hart
keywords:
  - "report"
  - "pdf"
  - "output"
---

Create a Report from a DB or File Definition, design its layout, then add it to a Flow to produce a viewer, printer, file or email output.

## Before you begin

- **Audience:** Velox implementers and Report designers.
- **Prerequisites:** A tested source Definition with representative sanitised data and a manually tested Flow for the eventual Report step.
- **Permissions:** Access to create Reports and read the source. Runtime output also needs service-account access to printers, folders or configured email delivery.
- **Starting state:** Design with non-production data and send output only to an approved test viewer, folder, printer or recipient.

:::warning Reports can disclose source data
Generated files, printouts and email attachments can contain the complete source dataset. Use least-privilege destinations, sanitised test data and approved recipients. Do not embed credentials or confidential values in filenames or email fields.
:::

## Steps

1. In Designer, create a **Report** and enter a distinctive **Report Name**.
2. Under **Source Data**, select **DB Definition** or **File Definition**, then choose the tested **Definition**.
3. Configure the applicable settings:
   - **If there is no data print as much as possible** controls whether static report content can still be produced when detail data is absent.
   - **Print individual report for each master record** processes master records as separate report runs.
   - **Embed fonts in PDF output** improves font portability but increases PDF size.
   - **Use "warnings" for report errors rather than "errors"** downgrades report-processing failures. Select it only when downstream processing is safe after an incomplete report.
4. Select **Design**. Add the required data fields, headings, grouping and formatting in the Report designer.
   Report code can read `Settings`, `Globals`, Flow `Locals` and configured Variable Groups. For example, `Variables['MyGroup']['MyVariable'].AsString` uses the group code without its stored `V_` prefix.
5. Save the design with **Quick Save**, then return to **Settings** and save the Report module.
6. Add a **Report** step to a controlled Flow and select the Report and its source Flow data item.
7. Choose an **Output Destination**: viewer, printer, file or email. For file or email, choose the required supported **Output Type** and supply the destination details shown by Designer.
8. For a file, use an approved test path and filename. For email, use approved test recipients, subject and attachment filename. For a printer, verify the printer visible to the runtime identity.
9. Run the Flow with sanitised data and inspect the execution log and generated output.

Supported output types currently shown by Designer include PDF, HTML, PNG, JPEG, BMP, Excel `.xlsx`, Excel `.xls` and RTF. Do not use the legacy XHTML choice; current loading converts it to HTML.

## Verify the result

Confirm that:

- the correct source records appear with expected grouping, pagination and totals;
- empty-source behaviour matches the selected setting;
- each master record produces the intended number of reports;
- files open in the expected format and PDF fonts render on a separate test system where relevant;
- printer or email output reaches only the intended test destination; and
- warnings and errors in the Flow log reflect the actual output outcome.

## Recover or roll back

Keep the consuming Flow inactive while correcting the Report. Delete test output only after preserving any evidence needed for diagnosis. Recall or delete an email only through the mail system's approved process; Velox cannot reverse a delivered message. Restore the last approved Report/configuration if a layout change cannot be safely corrected.

## Troubleshoot

- **Design does not open or data fields are missing:** test the source Definition and reopen the Report after correcting its views or fields.
- **The run is cancelled with no data:** verify source criteria and runtime parameters, then review the no-data setting.
- **The output path fails:** test the folder using the VeloxService account and confirm the resolved filename is valid.
- **Email fails:** verify configured email delivery, recipients and attachment filename; do not repeatedly resend until delivery status is known.
- **A PDF image becomes a solid colour:** confirm the installed build includes the current scaled-image correction; for an older build, clear **PDFSettings > ScaleImages** as a diagnostic while leaving the image object's **Stretch** setting to control layout.
- **A Report error appears only as a warning:** review **Use "warnings" for report errors rather than "errors"** and clear it when failure must stop the Flow.

## Next steps

Review [Flow steps](../../flows/steps/index.md), [execution policy](../../flows/flow-properties-and-execution-policy.md) and [Execution Logs](../../../operate-and-troubleshoot/execution-logs.md) before scheduling Report output. Continue with [layout, output and delivery](layout-output-and-delivery.md) and [runtime troubleshooting](runtime-and-troubleshooting.md).
