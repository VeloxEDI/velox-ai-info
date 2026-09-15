---
title: "Schedule a Flow"
description: "Configure startup, monthly, weekly, daily and repeating execution"
sidebar_position: 20
slug: /flows/schedules
classification: public
status: approved
owner: Cam Hart
keywords:
  - "schedule"
  - "automation"
  - "service"
---

Configure VeloxService to run a tested Flow on a daily, weekly or monthly schedule. A schedule can run once at its start time or repeat within a defined time window.

## Saved defaults

| Setting | New-Flow default |
| --- | --- |
| Schedule occurrence | Daily |
| Run once immediately | Cleared |
| Repeats | Cleared |
| Repeat interval/unit | `10` minutes |
| Daily interval | Every `1` day |
| Monthly day | Day `1` |
| Weekly days | Monday through Friday |
| Start time | 12:01 am |
| End/Until time | No explicit value (`0`) |

Defaults describe a newly created module; they do not activate a schedule while the trigger remains manual/none.

## Before you begin

- **Audience:** Velox implementers and administrators responsible for automated processing.
- **Prerequisites:** A saved Flow that has completed controlled manual testing, including its Connections, data, action steps and completion behaviour.
- **Permissions:** Access to edit the Flow and to verify VeloxService. The service account needs every database, filesystem and external-system permission required by the Flow.
- **Starting state:** Make the Flow inactive while changing and testing its schedule. Confirm the server's clock and time zone, and choose a quiet test window.

:::warning Scheduled runs perform real work
A scheduled run uses the Flow's normal configured effects. A short repeat interval, overlapping window or unexpected start-up run can duplicate database, file or external-system work. Prove that the Flow can run repeatedly and recover safely before activating it.
:::

## Steps

1. Open the Flow in Velox Designer and select **Execution**.
2. Clear **Active** while you prepare the schedule.
3. For **Trigger**, select **Run at scheduled intervals**.
4. Under **Occurs**, choose **Daily**, **Weekly** or **Monthly**, then configure the corresponding interval:
   - For **Daily**, set `1` to `365` days between runs.
   - For **Weekly**, set `1` to `52` weeks and select the required weekdays.
   - For **Monthly**, set `1` to `12` months and a day from `1` to `31`. Test the required behaviour for dates that do not occur in every month.
5. Set the execution time using **at** or **starting**, as displayed for the selected schedule.
6. To run more than once in the schedule window, select **Repeats**, set **every** to an interval from `1` to `999` in milliseconds, seconds, minutes or hours, and set **Until**. Start with an interval that is longer than the Flow's verified worst-case duration.
7. Select **Run once immediately on start up of VeloxService** only when an immediate execution whenever the schedule starts is an intended and tested outcome. Leave it clear when processing must wait for the configured time.
8. Review the Flow's [completion and retry behaviour](../flow-properties-and-execution-policy.md). In particular, confirm whether retries or continuation after cancellation could repeat an external effect.
9. Save the Flow while it remains inactive. Reopen it and confirm that the schedule values were saved.
10. Run one final controlled [manual test](manual-runs.md), then select **Active** and save the Flow.
11. Verify the service state and the Flow's next-run information. Do not assume that saving a schedule proves the runtime accepted it.

An **Until** time earlier than the start time defines a window that continues across midnight. Test an overnight schedule in the target time zone before relying on it.

## Verify the result

At the first scheduled time, confirm that:

- exactly one expected execution starts unless a repeating window intentionally permits more;
- the execution log identifies the intended Flow and configuration;
- each destination contains the expected result once;
- the run finishes before the next permitted start; and
- the displayed next-run information matches the intended day, time and interval.

Repeat the check after a planned VeloxService restart if **Run once immediately on start up of VeloxService** is enabled.

## Recover or roll back

If the schedule is unsafe or incorrect, clear **Active** and save the Flow. Confirm that no new execution starts, then preserve the relevant logs and recover each affected destination through its approved process. Disabling a schedule does not undo work that has already started or completed.

## Troubleshoot

- **The Flow does not run:** confirm **Active**, **Run at scheduled intervals**, the selected weekday or month day, the server clock and time zone, and the VeloxService state and permissions.
- **Repeating runs do not start:** confirm **Repeats**, the interval and the start/**Until** window. Check whether the previous execution is still using the Flow's available execution capacity.
- **The Flow runs unexpectedly after service start:** review **Run once immediately on start up of VeloxService**.
- **The Flow runs twice or processes the same item twice:** check for an immediate start-up run, an overlapping repeat interval, a manual run, another trigger or duplicated input. Disable the Flow before investigating destinations.
- **Saved changes do not appear at runtime:** save again after confirming service control is available, then verify the service state and next-run information. Escalate with the configuration and logs rather than repeatedly restarting processing.

## Next steps

Use [file monitoring](file-monitors.md) when arrival of a file should trigger processing instead of a clock-based schedule. Operational service controls are covered in [Control Velox services](../../../administer-velox/service-control/index.md).
