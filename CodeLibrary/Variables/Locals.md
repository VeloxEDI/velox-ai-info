---
title: "Locals"
description: "Scripter-field scratch variants and the distinct action-owned named local variable list."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - locals
  - scope
---

Velox exposes two local-state models. `Local1` through `Local10` are raw `Variant` fields on one `TvxScripter`. `Locals` is a case-insensitive named `TvxVariableList` owned by the current action and shared with scripts—and, deliberately, linked subactions—using that action context.

## Scope and reset comparison

| Entry | Scope | Reset behaviour | Sharing |
|---|---|---|---|
| `Local1`-`Local10` | One `TvxScripter` instance | Starts `Unassigned` when the scripter is constructed; current source does not reset it for every later execution | Not shared with another scripter, even in the same action |
| `Locals['Code']` | Current action | Normal action cleanup closes variable datasets and sets retained values to `Null` | Shared across the action's scripts; borrowed by linked/subactions and can be populated from API query fields |

## Critical numbered-local quirk

Map and script-item scripters can be reused. Because the executable source does not assign `Unassigned` to `FLocal1`-`FLocal10` before every run, a numbered Local can contain a value left by a previous execution of that same scripter. Always initialise a numbered Local on every control-flow path before reading it. Do not use “not assigned this time” as a state signal.

## Named Locals

`Locals['Code']` performs a case-insensitive lookup and creates a missing `TvxVariable` with `Null`. Normal cleanup retains the variable object/name for reuse but nulls its value; dynamically generated codes can therefore grow the list over time. Use stable names and define expected type/default ownership.

Linked actions and subactions receive the parent list's variable objects rather than isolated copies. A child can observe or mutate values that the parent uses. Velox clears the child's borrowed list references after execution so it does not free parent-owned variables.

## Choosing state

Use a numbered Local only for short-lived state confined to one known scripter and explicitly initialise it. Use named `Locals` when several action scripts or an intentional child flow must share a value by contract. Use neither as durable storage, authentication, request validation or a transaction.

Variants can change runtime type. `Unassigned`, `Null`, empty text, zero and `False` differ, and conversion/operators can raise or propagate `Null`. Avoid storing live object references, datasets, large payloads, credentials or personal data in scratch state.

Neither form is automatically persisted. Named Locals use locks for individual list/value access, but compound read-modify-write is not an atomic business operation. Do not hand either form to asynchronous work.

<small>Created 2026-07-19</small>
