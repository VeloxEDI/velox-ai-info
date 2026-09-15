---
title: "Velox"
description: "Velox-specific functions for resolving configured module identifiers, converting product types and statuses, and classifying source/module metadata."
sidebar_position: 25
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - fid
  - mapping
  - status
  - source
---

The Velox group contains product-specific helpers for working with governed configuration identifiers and the numeric/text constants used by Velox business documents. It also includes fixed transforms between related document families, display labels for internal class names, and source classification.

These functions do not all have the same failure contract. Choose the exact entry for the data domain and distinguish `EmptyGuid`, `Null`, `Unknown`, error-prefixed text and unchanged fallback text.

## Choosing an entry

- Use a typed FID helper such as [`GetMapFID`](Velox/GetMapFID.md), [`GetTransportFID`](Velox/GetTransportFID.md) or [`GetVariableFID`](Velox/GetVariableFID.md) to resolve a configured module's `MODULENAME`. Prefer these fixed-table wrappers to generic [`GetFID`](Velox/GetFID.md).
- Use the reciprocal `...Code` and `...Num` functions to convert between a specific Velox numeric domain and its canonical text. For example, [`GetOrderStatusCode`](Velox/GetOrderStatusCode.md) and [`GetOrderStatusNum`](Velox/GetOrderStatusNum.md) operate only on order status.
- Use the `GetOrderType...For...` helpers when converting customer/supplier direction from an ASN or invoice type into an order type. These are cross-family business transforms, not generic code/number converters.
- Use [`GetNameForModuleType`](Velox/GetNameForModuleType.md) or [`TransportForType`](Velox/TransportForType.md) for labels derived from internal Delphi class names. These helpers are case-sensitive.
- Use [`GetSourceCode`](Velox/GetSourceCode.md) or [`GetSourceNum`](Velox/GetSourceNum.md) to validate/convert the four recognized source values before using [`IsSourceInternal`](Velox/IsSourceInternal.md) or [`IsSourcePartner`](Velox/IsSourcePartner.md).

## FID resolution is a live database operation

The typed FID functions query the current Velox system/configuration database and return a binary `TGuid`. A no-row query returns the all-zero `EmptyGuid`; it does not return `Null` or raise a “not found” exception. Test with [`IsEmptyGuid`](Guid/IsEmptyGuid.md) before using the result as a reference.

Name comparison, case, trailing spaces, duplicates and transaction visibility are governed by the database. Each call creates a query and there is no name cache, so resolve stable names outside record-level loops. Connection, schema, permission, execution and GUID-conversion failures propagate.

Generic `GetFID` inserts its table argument directly into SQL syntax. Never supply that argument from message, user or other untrusted data. The name is quoted through Velox `SQLString`, but embedded NUL characters are deleted before lookup; that conversion is lossy. The typed wrappers avoid the dynamic-table boundary.

Resolving an FID does not prove that the module is enabled, authorized, correctly configured or appropriate for a later operation.

## Fixed code and number mappings

Most code-input functions use Delphi `SameText`: ASCII letter case is ignored, but the whole string must match and no trimming occurs. Empty, whitespace-altered and unknown text normally return `Null`. Numeric text is not parsed.

Most number-input functions use an explicit Variant Null comparison followed by a fixed `case`. A supported integer returns its canonical code and an unknown comparable value returns `Null`. Do not rely on Variant coercion from strings, floating-point values or booleans. The explicit Null path also depends on Delphi's process-global `NullEqualityRule`; individual pages link the applicable RTL references.

The mapping is compiled into product source. Database labels or customer configuration cannot add aliases. Test `VarIsNull` before assigning a conversion result to a non-nullable destination.

## Keep semantic families separate

The same representation can mean different things in different document families. `Delivered`, `Updated` and `Cancelled` appear in ASN, POD and tracking status maps, while many type families reuse numbers `1` and `2`. Always call the converter for the actual field; do not treat equal numbers or text as proof that two domains are interchangeable.

The ASN/invoice-to-order helpers deliberately transform direction:

- Customer ASN becomes SalesOrder; Supplier ASN becomes PurchaseOrder.
- Customer invoice and customer credit both become SalesOrder.
- Supplier invoice and supplier credit both become PurchaseOrder.

This transform does not create, validate or alter a document.

## Important implementation boundaries

- Event type `0` is valid (`ReceiveCompany`). Do not use zero as a generic missing-value sentinel; see [`GetEventTypeCode`](Velox/GetEventTypeCode.md).
- Party type `Company` is `100`, outside the `1`–`8` sequence. [`GetReferenceTableForPartyType`](Velox/GetReferenceTableForPartyType.md) returns prefixed `Party_...` text and uses literal `Unknown`, not `Null`, for unsupported numbers.
- UOM Quantity and Unit are the same observable value: both internal numbers are `1` and both internal strings are `Unit`. Literal `Quantity` is not accepted; see [`GetUomTypeNum`](Velox/GetUomTypeNum.md).
- [`GetIssueForPartyType`](Velox/GetIssueForPartyType.md) returns an integer issue number, while separately exposed `Ixxxx` issue constants are strings containing digits.
- `GetNameForModuleType` returns an unrecognized class name unchanged. `TransportForType` instead returns `ERROR: ` followed by the unchanged input. Neither function loads or validates a module.
- `IsSourceInternal` is true only for App source `1`. `IsSourcePartner` is its exact negation, so every other integer—including invalid and future values—is classified as partner/external. Source metadata is not authentication.

## Safe scripting practice

Treat mapping output as typed metadata, not authorization. Validate external inputs against the exact conversion function, handle `Null`/`EmptyGuid` explicitly, and apply the execution context's normal access, logging and sensitive-data controls. When a result is used to select later configuration or SQL behavior, restrict it to the documented fixed outputs rather than concatenating arbitrary fallback text.

Use the child pages for complete tables, exact declarations, examples, exceptions, source traces and direct Delphi/Free Pascal references. The navigation below is generated from the current Code Library inventory.
