---
title: "Configure Maps"
description: "Transform source data into destination data with a Velox Map"
sidebar_position: 10
slug: /transform-output/maps
classification: public
status: approved
owner: Cam Hart
keywords:
  - "map"
  - "transformation"
  - "fields"
---

Create a Map that reads one DB or File Definition and writes transformed records to another. Use the Map designer to associate source values with destination fields and add scripting only where a direct mapping is insufficient.

## Before you begin

- **Audience:** Velox implementers and script authors.
- **Prerequisites:** Tested source and destination Definitions with representative sanitised data. Understand their master/detail views, field types, keys and destination write behaviour.
- **Permissions:** Access to create Maps and read both Definitions. Testing also needs the database and filesystem permissions used by their Connections.
- **Starting state:** Use non-production data and a destination constrained to an empty test result set.

:::danger A Flow Map can write destination data
**Test Map** in the Map designer does not save mapped destination data. A Map step run by a Flow can save it, including during a Flow **Test Run**. Isolate the destination and verify recovery before adding the Map to a Flow.
:::

## Steps

1. In Designer, create a **Map** and enter a distinctive **Map Name**.
2. Under **Source Data**, select **DB Definition** or **File Definition**, then choose the tested source **Definition**.
3. Under **Destination Data**, select **DB Definition** or **File Definition**, then choose the tested destination **Definition**.
4. Select **Map**. Velox opens and synchronises both Definitions. If either cannot be opened cleanly, correct it instead of designing against an incomplete structure. Use read-only mode only for inspection.
5. In the Map designer, select a destination view and field. Drag the matching source field onto it to create a mapping expression.
6. For master/detail data, map the destination view to the correct source view before mapping its fields.
7. Open each generated field event and confirm the expression, destination type and null handling. Use **Preview Result** with sanitised source data where available.
8. Add the smallest required script for conversions, conditional values or record-level behaviour. Use **Test Compile** and fix every compilation error.
9. Use **Test Map** and inspect the preview, record counts, warnings and errors. Confirm that the destination preview is correct and that no production system was changed.
10. Select **Quick Save** or return to settings and **Save** the Map.
11. Add the Map to a controlled Flow only after the standalone Map test passes. Run the Flow with an isolated destination and verify the persisted result.

When a destination Definition changes, reopen the Map and review the synchronisation prompt. Resetting the mapping can remove existing expressions, so preserve the current configuration and review the change before accepting it.

## Verify the result

Confirm that:

- every required destination view and field has the intended source or explicit formula;
- data types, nulls, dates, numbers and identifiers are correct at boundary values;
- master/detail records retain the intended relationships;
- **Test Compile** and **Test Map** complete without unexplained warnings or errors;
- an isolated Flow run writes the expected records once; and
- execution logs show expected source, destination and record counts.

## Recover or roll back

Keep the consuming Flow inactive while correcting a Map. Restore or compensate destination data through the owning database/file recovery process. Do not rerun an uncertain Map against the same input until you have confirmed whether the first attempt wrote records. If Definition changes invalidate many mappings, restore the last approved configuration and reconcile fields deliberately.

## Troubleshoot

- **The Map cannot open:** test both Definitions and their Connections, then correct missing views, fields or permissions.
- **The Map is out of sync:** review changes to the destination Definition and resave the Map after reconciling every added, removed or renamed field.
- **No data is processed:** verify the source Definition criteria and parameters with the same runtime values used by the Flow.
- **The destination is already populated:** constrain its Definition so the Map starts with an empty destination dataset; do not bypass this protection.
- **A formula fails:** use **Test Compile**, inspect the event scope and types, and validate referenced variables or Scriptlets.

## Next steps

Review [Data Definition concepts](../../data-definitions/definition-concepts.md), [scripting concepts](../../scripting-code-library/scripting-concepts.md) and [Flow steps](../../flows/steps/index.md) before operational use. Continue with [sources, targets and mappings](sources-targets-and-mappings.md), [expressions and validation](expressions-and-validation.md), and [runtime troubleshooting](runtime-and-troubleshooting.md).
