---
title: Velox
description: "Velox business-domain constants for interfaces, events, transaction lifecycles, statuses, types, sources and governed Issue codes."
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, vxdata, issue, event, status, lifecycle, interface]
---

## Available families

The 554 entries in this group are compiled script constants for Velox/VxData domains. Each child page traces the declaration, PascalScript registration, tag-map behavior where present, current schema/seed meaning and known consumers.

| Family | Entries | Purpose and key boundary |
|---|---:|---|
| Issue codes `I####` | 252 | String identities such as [`I1000`](Velox/I1000.md) and [`I5000`](Velox/I5000.md). They identify configured Issue definitions; they do not validate, query, log, persist or set severity by themselves. |
| Interface identifiers `Intf_*` | 71 | Numeric/String pairs such as [`Intf_Order`](Velox/Intf_Order.md) and [`Intf_Order_String`](Velox/Intf_Order_String.md), plus the [`Intf_`](Velox/Intf_.md) tag prefix. Used by interface metadata and tag expansion. |
| Business vocabulary `Type_*` | 72 | Party, transaction, packaging, container-move and relationship types. Most have numeric/String pairs, but the exact database domain differs by receiving table/field. |
| Event actions `Event_*` | 42 | Company/partner receive, send, control, collect/deliver, notify and POD actions. Numeric/String pairs feed event/action configuration; several source literals have documented quirks. |
| Order lifecycle/type | 32 | Order header, line and response states plus order kinds; [`Order_Ordered`](Velox/Order_Ordered.md) is not a general processing status. |
| General status `Status_*` | 18 | Numeric/String pairs for NotSet, Success, Warning, Issue, Duplicate, Cancelled, Error, Test and Highlight. Shares log ordinals but not every lifecycle scale. |
| Shipment lifecycle | 14 | Draft, planned, booked, collected, delivered, problem and cancelled numeric/String states. |
| Invoice lifecycle/type | 10 | Updated, invoiced, cancelled and four invoice/credit directions. |
| Party roles `Party_*` | 9 | Numeric roles from Customer/Supplier through Company; numeric aliases overlap some `Type_*` values. |
| ASN lifecycle/type | 8 | Updated, delivered, cancelled plus customer/supplier ASN directions. |
| Source channels | 8 | API, application, EDI and web numeric/String origins. |
| POD lifecycle | 6 | Updated, delivered and cancelled numeric/String states. |
| Tracking lifecycle | 6 | Updated, delivered and cancelled numeric/String states. |
| Temperature | 6 | Ambient, chilled and frozen numeric/String transport categories. |

## Issue-code ranges

Issue identifiers are **String** constants even though their text contains digits. The default VxData Issue row supplies the title and status/severity, and deployments can change data independently of the compiled identifier. Consumers such as issue lookup, logging and deferred transaction persistence have different side effects; consult the exact `I####` page.

| Range | Published entries | Default subject area |
|---|---:|---|
| [`I1000`](Velox/I1000.md)-[`I1046`](Velox/I1046.md) | 46 | General/not-set, conversion, system and mapping diagnostics. |
| [`I1101`](Velox/I1101.md)-[`I1171`](Velox/I1171.md) | 27 | Transaction not-found and related order/invoice/shipment families. |
| [`I1201`](Velox/I1201.md)-[`I1227`](Velox/I1227.md) | 22 | Transaction missing/invalid required-value validation. |
| [`I1410`](Velox/I1410.md)-[`I1446`](Velox/I1446.md) | 36 | Master-data/object validation. |
| [`I1510`](Velox/I1510.md)-[`I1542`](Velox/I1542.md) | 26 | Master-data/object auto-created or changed outcomes. |
| [`I1601`](Velox/I1601.md)-[`I1671`](Velox/I1671.md) | 27 | Transaction auto-created outcomes. |
| [`I1710`](Velox/I1710.md)-[`I1746`](Velox/I1746.md) | 37 | Master-data/object code-not-specified diagnostics. |
| [`I1801`](Velox/I1801.md)-[`I1871`](Velox/I1871.md) | 27 | Transaction code-not-specified diagnostics. |
| [`I5000`](Velox/I5000.md)-[`I5003`](Velox/I5003.md) | 4 | System error, authorization/access and unexpected-failure diagnostics. |

The ranges are intentionally sparse. Never construct a code by arithmetic and assume a row exists. Use the published identifier and verify the deployed Issue definition when severity or routing affects control flow.

## Numeric and String pairs

Many families expose both `Name` and `Name_String`. They are related definitions, not automatically interchangeable representations. A database field or API may require the numeric key, the code text or a foreign key resolved elsewhere. PascalScript erases domain type information from plain integers and strings, so same-valued constants from different families can pass superficial checks.

Use the detailed page to identify:

- the exact numeric and text literal, including source spelling/truncation defects;
- the VxData table/column and seeded row, if any;
- whether `<!Constant!>` tag expansion is registered and whether it yields the number or text;
- current product consumers and whether they compare code, number or enum ordinal; and
- lifecycle, direction and general-status domains that reuse a number with different meaning.

Known examples include the compiled `Event_SendControlCompany_String` value `SendControlCompan` (missing the final `y`) and direction labels whose historical database naming can be counterintuitive. The child page records the current source behavior; do not silently “correct” a literal in configuration.

## Fixed code versus live VxData meaning

Reading one of these constants is side-effect free and does not access VxData. The compiled value remains fixed until the product is rebuilt. Its operational meaning can additionally depend on seeded or locally maintained rows, foreign keys, Scriptlets and application code. Therefore:

- do not treat a constant as proof that a row exists in an upgraded/custom database;
- do not infer current severity from the digits in an Issue code;
- do not use lifecycle values in a general `Status` field, or general status values in `Order.StatusNum`, `Invoice.StatusNum`, `Shipment.StatusNum`, POD or tracking fields;
- do not assume assigning a value creates an Event, Issue, transaction or audit record; and
- validate external mappings at the system boundary rather than exporting internal numbers without a contract.

For configuration design, use named constants in scripts, the exact receiving module/field documentation and the corresponding child page. When changing governed database vocabulary, update source, seed/migration data and dependent configurations together; a local database edit alone does not change compiled script constants.

No live VxData query, event, issue, flow, file or image function was executed while documenting this group.

<small>Created 2026-07-15</small>
