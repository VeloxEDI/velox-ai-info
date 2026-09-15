---
title: "Configure file-transfer Transports"
description: "Configure verified FTP, SFTP and LAN inbound/outbound exchange"
sidebar_position: 10
slug: /transports/file-transfer-transports
classification: public
status: approved
owner: Cam Hart
keywords: ["ftp", "sftp", "lan"]
---

Configure an inbound or outbound FTP, SFTP or LAN Transport for file exchange. Test the exact server implementation and security policy used by the target environment.

## Scope

FTP and SFTP use a host, port, credentials/authentication and remote path. LAN uses a UNC path available to the VeloxService account. Inbound Transports collect matching content into the configured local file lifecycle; outbound Transports send Flow-created files.

## Verified settings

| Transport | Main settings | Direction-specific settings |
| --- | --- | --- |
| FTP | **Host**, **Port**, **User Name**, **Password**, **Path**, **SSL Settings**, active/passive method and timeouts | Inbound **After Receiving**; outbound temporary filename, post-upload move and indicator-file choices |
| SFTP | **Host**, **Port**, **User Name**, **Password**, **Path**, **Version**, **Authentication Type** and timeouts | Inbound **After Receiving**/**Move to Folder**; outbound temporary filename, post-upload move and indicator-file choices |
| LAN | **UNC Path** | Inbound processing delay and **After Receiving**; outbound destination path |

Use an approved secret store/configuration process. Do not place passwords or private-key material in documentation. Select TLS/SSH versions, certificates and host verification only from the deployment security policy; the existence of a UI option does not certify interoperability.

## Controlled setup

1. Create the required inbound or outbound Transport and leave **Active** clear.
2. Enter the endpoint/path and approved authentication values. Use a dedicated test account and folder.
3. Configure timeouts and, for FTP, the method required by the tested server.
4. For inbound use, set **After Receiving** deliberately so a successfully collected remote file is not collected again. Confirm the local File Connection lifecycle.
5. For outbound use, decide whether the receiver requires a temporary upload name, final rename, indicator file or post-upload local move.
6. Select **Test with...** and use one sanitised file. Verify both remote and local outcomes.
7. Save, link the Transport to a controlled Flow, then activate only after end-to-end testing.

## Constraints and failure behaviour

- Interactive access does not prove VeloxService can access a UNC path, certificate/key or remote host.
- FTP, FTPS and SFTP are different protocols; do not infer security from a similar name or port.
- A timeout leaves delivery state uncertain. Check the remote destination and Transport Log before retrying.
- Temporary names and indicator files require receiver agreement and collision testing.
- Inbound move/delete behaviour can lose the only remote copy if local processing is not recoverable.

## Related references

- [FTP input](ftp-input.md) and [FTP output](ftp-output.md)
- [SFTP input](sftp-input.md) and [SFTP output](sftp-output.md)
- [LAN input](lan-input.md) and [LAN output](lan-output.md)
- [Test and operate Transports](../operate-transports.md)
- [Configure File Connections](../../connections/file/index.md)
- [File and Transport troubleshooting](../../../operate-and-troubleshoot/file-and-transport-troubleshooting.md)
