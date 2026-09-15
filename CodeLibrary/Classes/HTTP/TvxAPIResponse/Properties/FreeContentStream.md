---
title: FreeContentStream
description: Controls WebBroker ownership of the current response stream during replacement and destruction, independently of Indy's non-owning bridge reference.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, stream, ownership, memory]
---

```Delphi
property FreeContentStream: Boolean read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Keep the normal host ownership contract. }
    Response.FreeContentStream := True;
    Value := Response.FreeContentStream;
  end;
end;
```

### Usage

`FreeContentStream` controls WebBroker ownership of the current response stream during replacement and destruction, independently of Velox's non-owning bridge reference.

### Additional Technical Info
`FreeContentStream` controls the inherited WebBroker response's ownership of [`Content`](Content.md). A valid response starts with this property true, and Velox assigns a new response memory stream before the API action executes.

When true:

- assigning a different `Content` stream frees the previous WebBroker stream immediately;
- assigning the new stream transfers its ownership to the response; and
- destroying the response frees the current stream.

When false, replacement/destruction merely abandons or clears WebBroker's reference; the separate stream owner must keep it alive through sending and free it afterward. Replacing a stream while false can lose the only cleanup path to the old stream.

The Indy `TIdHTTPResponseInfo` has a separate property with the same name. The bridge always sets that Indy flag false because WebBroker controls the shared stream. Changing this script property does **not** change Indy's flag. Consequently setting it false on Velox's host-created memory stream, without retaining a legitimate external owner, leaks the stream: neither Indy nor WebBroker frees it.

Leave the default true for normal script-created/Velox-created response streams. Use false only when another well-defined host component owns the exact stream for longer than the entire send and has a reliable later cleanup path. Scripts cannot safely retain the response after the API event, so borrowed-stream designs require particular care. Do not toggle the flag to work around double-free symptoms without tracing every owner.

The property does not clone, rewind or send the stream. Changes are unsynchronised. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.FreeContentStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.FreeContentStream)
- [Embarcadero DocWiki: `TWebResponse.ContentStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentStream)
- [Embarcadero DocWiki: `System.Classes.TStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream)

<small>Created 2026-07-15</small>
