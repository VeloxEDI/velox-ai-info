---
title: fmShareCompat
description: Selects the zero-valued legacy DOS-compatible share slot, which currently grants no competing access on Windows.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, sharing, compatibility]
---

```Delphi
fmShareCompat = 0
```

### Example

```Delphi
function OpenLegacyCompatible(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenRead or fmShareCompat);
end;
```

### Usage

`fmShareCompat` selects the zero-valued legacy DOS-compatible share slot, which currently grants no competing access on Windows.

### Additional Technical Info
`fmShareCompat` selects Delphi's legacy DOS/FCB compatibility share value. It is a share-mode alternative, not an access mode, and should be OR-ed with one `fmOpen*` value.

In the current Windows RTL its share-table entry is zero, exactly like [`fmShareExclusive`](fmShareExclusive.md). No read or write sharing permission is passed to `CreateFile`, so compatible competing opens are denied while the handle remains open. Because this constant itself is zero, `fmOpenRead or fmShareCompat` is numerically indistinguishable from bare `fmOpenRead`.

Do not use the name “Compat” to infer portable or collaborative behavior. Embarcadero marks the DOS-compatible mode nonportable, and Free Pascal documents platform-specific/advisory locking differences. Prefer an explicit intent-revealing choice: DenyWrite for shared stable reads, DenyNone for intentionally concurrent access, or Exclusive when no competing compatible open is acceptable.

The example returns an owned stream that its caller must free. It is source-reviewed only and was not executed.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
