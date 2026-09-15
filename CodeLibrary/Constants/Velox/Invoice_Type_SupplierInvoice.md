---
title: Invoice_Type_SupplierInvoice
description: Provides deprecated invoice-type alias value 3 for compatibility with scripts that predate Type_SupplierInvoice.
sidebar_position: 381
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - invoice
  - invoice-type
  - deprecated
  - compatibility
---

```Delphi
Invoice_Type_SupplierInvoice = 3
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Existing scripts may still use the compatibility alias.
  if Invoice_Type_SupplierInvoice = Type_SupplierInvoice then
    Value := Type_SupplierInvoice_String; // 'SupplierInvoice'
end;
```

### Usage

`Invoice_Type_SupplierInvoice` provides deprecated invoice-type alias value 3 for compatibility with scripts that predate Type_SupplierInvoice.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Preferred identifier | [`Type_SupplierInvoice`](./Type_SupplierInvoice.md) |
| Canonical code | [`Type_SupplierInvoice_String`](./Type_SupplierInvoice_String.md) = `SupplierInvoice` |
| Database domain | `Invoice_Type.Num` and `Invoice_Hdr.TypeNum` |

### Additional Technical Info
`Invoice_Type_SupplierInvoice` is a deprecated compatibility alias for the supplier invoice invoice type. Its fixed `LongInt` value is `3`, identical to [`Type_SupplierInvoice`](./Type_SupplierInvoice.md). Existing scripts can continue to read it, but new or revised scripts should use the `Type_*` identifier family.

The alias identifies an invoice type; it does not create, classify, validate or persist an invoice.

**Implementation**

Current native source places `Invoice_Type_SupplierInvoice` in an explicitly deprecated block and assigns it value `3`. The PascalScript importer still registers the alias as a `LongInt` for backwards compatibility. The preferred `Type_SupplierInvoice` constant is independently registered with the same value.

A fresh VxData database seeds `Invoice_Type` row `3` with code `SupplierInvoice`. `Invoice_Hdr.TypeNum` has a foreign key to that numeric domain. Current `GetInvoiceTypeNum` and `GetInvoiceTypeCode` implementations use the preferred `Type_*` constants and their String partners, not the deprecated `Invoice_Type_*` names.

**Behaviour**

Reading the alias produces exactly the same integer as `Type_SupplierInvoice`. Once evaluated, the integer carries no information about which identifier spelling the script used. Deprecation is advisory in the current scripting surface: the name remains registered and does not itself emit a warning.

The Velox constant tag map exposes `Type_SupplierInvoice`, not `Invoice_Type_SupplierInvoice`. Use `<!Type_SupplierInvoice!>` where a numeric configuration tag is required.

**Edge cases and quirks**

- There is no `Invoice_Type_SupplierInvoice_String` compatibility constant. Use `Type_SupplierInvoice_String` for the canonical code.
- Numeric invoice-type values are not type-safe in PascalScript and overlap values in other type/status families. Use the identifier belonging to `Invoice_Hdr.TypeNum` or another explicitly documented invoice-type field.
- The generated index does not currently carry a deprecation flag for this page even though native source marks the alias deprecated. The source-backed deprecation guidance therefore appears in the Markdown body.
- No removal version is declared in current source. Do not infer either permanent support or a specific removal date.

**Side effects**

Reading or comparing `Invoice_Type_SupplierInvoice` has no I/O or state-changing side effect. Persisting `3` or running invoice processing is behaviour of the caller.

**Errors**

Reading the alias does not raise an error. Using the integer in the wrong numeric domain can select incorrect logic; persisting an invalid type outside the seeded `Invoice_Type` keys can fail the relevant database constraint.

**Performance and concurrency**

This is an immutable compiled value. Access is constant-time, allocates no persistent resource and carries no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. Migrate the identifier spelling to `Type_SupplierInvoice` when editing an existing script; the numeric result remains `3`.

**Related entries**

- [`Type_SupplierInvoice`](./Type_SupplierInvoice.md) is the preferred numeric identifier.
- [`Type_SupplierInvoice_String`](./Type_SupplierInvoice_String.md) is the canonical invoice-type code.
- [`GetInvoiceTypeNum`](../../Functions/Velox/GetInvoiceTypeNum.md) converts a recognised code to its numeric type.
- [`GetInvoiceTypeCode`](../../Functions/Velox/GetInvoiceTypeCode.md) converts a supported number to its canonical code.

<small>Created 2026-07-15</small>
