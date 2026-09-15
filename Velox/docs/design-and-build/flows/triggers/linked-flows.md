---
title: "Link and call Flows"
description: "Configure sub-Flows and successor Flows within verified execution boundaries"
sidebar_position: 50
slug: /flows/linked-flows
classification: public
status: approved
owner: Cam Hart
keywords: [linked-flow, sub-flow, execution]
---

Velox supports two distinct Flow relationships:

- A **Sub Action** step calls another Flow inline. The child inherits the parent test flag and runtime locals, contributes status to the parent and does not save an independent master execution log.
- A **linked Flow** selects a parent Flow in its execution configuration. Active linked Flows run sequentially, in configured order, only after the parent succeeds. If one fails, later linked Flows stop and the parent records a warning.

## Configure reuse safely

1. Manually test the child Flow and identify its inputs, locals, side effects and status behaviour.
2. Choose a Sub Action when the child is part of the parent's step sequence; choose a linked Flow for ordered follow-on work after successful parent completion.
3. For a Sub Action, add the step and select the child Flow. For a linked Flow, configure its parent and **Linked Action Order**.
4. Draw the complete call graph and reject direct or indirect cycles. No cycle-protection guarantee is documented.
5. Confirm the child does not rely on a standalone trigger, log or local value that is unavailable in the selected relationship.
6. Test success, child error/cancellation and retry with fictional data. Inspect the parent log and every external side effect.

Changing a shared child can affect every caller. Retry of a parent can repeat child database, file, command or Transport effects. Use idempotent operations and correlation where possible.

To recover, disable the parent trigger, reconcile completed parent/child effects, restore the previous relationship or child version, and run one controlled test before re-enabling work.

- [Execution policy](../flow-properties-and-execution-policy.md)
- [Sub Action step](../steps/sub-action-step.md)
- [Flow runtime semantics](../runtime/index.md)
