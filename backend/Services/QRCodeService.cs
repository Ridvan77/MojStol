using QRCoder;
using System;
using System.IO;

public class QRCodeService
{
    public byte[] GenerateQRCode(string reservationData)
    {
        using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
        {
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(reservationData, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            return qrCode.GetGraphic(5);
        }
    }
}
