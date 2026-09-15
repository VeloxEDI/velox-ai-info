---
title: Type_CustomerRemittance_String
description: Provides the exact CustomerRemittance text paired with Type_CustomerRemittance for the Velox remittance-type domain.
sidebar_position: 504
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, transaction-type, remittance, string-constant]
---

```Delphi
Type_CustomerRemittance_String = 'CustomerRemittance'
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Type_CustomerRemittance_String; // 'CustomerRemittance'
end;
```

### Usage

`Type_CustomerRemittance_String` provides the exact CustomerRemittance text paired with Type_CustomerRemittance for the Velox remittance-type domain.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `'CustomerRemittance'` |
| Paired number | [`Type_CustomerRemittance`](./Type_CustomerRemittance.md) = `1` |
| Deprecated alias | None exposed in the reviewed source |
| Database domain | `Remittance_Type.Num; Remittance_Hdr.TypeNum` |
| Tag-map entry | No |

### Additional Technical Info
`Type_CustomerRemittance_String` is the canonical text for the **CustomerRemittance** member of the Velox remittance-type vocabulary. Its fixed `String` value is `'CustomerRemittance'`, paired with [`Type_CustomerRemittance`](./Type_CustomerRemittance.md).

It selects a domain value; it does not create, load, validate, send, receive, post or change the status of a transaction.

**Implementation**

Velox declares and registers exact text `CustomerRemittance`. The String identifier is not in the Velox tag map, and the reviewed implementation exposes no remittance-type converter.

The reviewed source exposes no `GetRemittanceTypeNum` or `GetRemittanceTypeCode` function. Numeric and String remittance constants are registered independently, so callers must compare them directly or use the owning data/configuration contract.

**Database alignment**

Fresh-build VxData seeds this exact row in `Remittance_Type`, and nullable `Remittance_Hdr.TypeNum` references that table. The reviewed fresh-build remittance script has no per-remittance-type event-routing table analogous to `Invoice_Event_Type` or `Order_Event_Type`.

The seed-table code is `CustomerRemittance` and its display description is human-spaced. The code, number and description are separate representations; persist the numeric key in `TypeNum` and use the exact code only where a code contract calls for it.

**Behaviour**

Reading the constant returns its compiled value exactly. Because no remittance converter exists, there is no built-in case-insensitive text normalisation, whitespace trimming or unknown-value-to-`Null` conversion for this family.

The paired numeric value has meaning only inside its remittance-type domain. Identical integers in party, source, status, shipment or other vocabularies are not interchangeable.

**Edge cases and quirks**

- `CustomerRemittance` identifies the customer-direction remittance domain. It does not prove who paid whom, that funds settled, or that invoice allocation/reconciliation succeeded.
- No converter normalises case or rejects whitespace for remittance text. Direct String comparison follows the comparison operation chosen by the script.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- The remittance family has no deprecated alias or converter in the reviewed source.
- A nullable header `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- The constant does not enforce event configuration, party relationships, lifecycle transitions or business-document validity.

**Side effects**

Reading or comparing `Type_CustomerRemittance_String` has no database, file, network or shared-state side effect. Converter and bridge helpers, where present, are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Callers own direct comparison and validation because no remittance converter supplies an unknown-value fallback. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access, fixed converters and fixed bridge lookups are constant-time for practical purposes and do not carry mutable transaction state.

**Remarks**

Customer/supplier and sales/purchase naming expresses Velox's transaction vocabulary, not a universal accounting or EDI interpretation. Confirm the mapping contract, parties, signs and downstream process independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_CustomerRemittance`](./Type_CustomerRemittance.md) is the paired numeric identifier.

<small>Created 2026-07-15</small>
