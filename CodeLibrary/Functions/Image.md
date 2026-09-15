---
title: "Image"
description: "Functions for re-encoding or proportionally resizing JPEG and PNG data between files and caller-owned streams."
sidebar_position: 17
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - image
  - resize
  - compression
  - streams
---

The Image group contains a file/stream matrix for two operations: re-encoding an image at a requested compression setting and proportionally fitting it inside a requested width/height box. Current implementations recognise JPEG and PNG rather than acting as general-purpose image converters.

## Choosing an entry

- Choose `CompressImage...` when dimensions must remain unchanged and the source should be decoded and re-encoded.
- Choose `ResizeImage...` when the image must fit proportionally within a bounding box.
- Select the `FileToFile`, `FileToStream`, `StreamToFile` or `StreamToStream` form according to where the bytes currently live and who owns the destination.

Representative entries include [`CompressImageFileToStream`](Image/CompressImageFileToStream.md), [`ResizeImageFileToFile`](Image/ResizeImageFileToFile.md) and [`ResizeImageStreamToStream`](Image/ResizeImageStreamToStream.md). The sidebar contains the complete generated matrix.

## Format selection and dimensions

File-source operations detect the supported source format. Stream-source operations inspect data at the stream's current position. For resized file destinations, the destination extension can select JPEG or PNG; stream destinations generally preserve the source format. Read the exact child page before assuming that renaming an extension converts a format or that compression has the same meaning for JPEG and PNG.

Resize dimensions describe a maximum box, not independent forced dimensions. The scale is the smaller of requested-width/source-width and requested-height/source-height, so the image can be upscaled when both requested limits are larger. Zero, negative, extreme and overflow-prone dimensions are unsafe inputs; validate limits before allocating or decoding.

Compression has format-specific rules. JPEG quality is assigned directly to the valid `1..100` range and re-encoding is lossy. PNG remains lossless, but Velox's current mapping makes compression level `0` unreachable and maps every input of 90 or greater to level `10`; the installed PNG component accepts only `0..9`, so range-checked product builds raise `ERangeError`. Treat that as a current product defect, not a useful maximum-quality setting.

## Ownership, effects and resource limits

Streams passed by the script remain caller/Velox-owned. Image procedures can read from the current source position and replace or append destination content according to the selected implementation; callers must establish and then inspect the documented positions. Do not free a stream supplied by Velox.

File destinations are external side effects and can be created or replaced before a later mapping failure. Source images can be hostile or unexpectedly large: compressed byte size does not bound decoded pixel memory. Restrict file size, pixel dimensions, format and destination path before processing untrusted input.

These pages are based on product-source analysis. No image operation or image-function test bed has been run as part of this documentation workflow.
