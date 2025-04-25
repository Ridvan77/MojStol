using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Utils;
using System.IO;
using System.Threading.Tasks;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message, byte[] attachment = null, string attachmentName = null)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
        email.To.Add(new MailboxAddress("", toEmail));
        email.Subject = subject;

        var bodyBuilder = new BodyBuilder();
        bodyBuilder.HtmlBody = message;

        if (attachment != null && !string.IsNullOrEmpty(attachmentName))
        {
            var imageContentId = MimeUtils.GenerateMessageId();
            var imageAttachment = bodyBuilder.LinkedResources.Add(attachmentName, attachment);
            imageAttachment.ContentId = imageContentId;
            imageAttachment.ContentType.MediaType = "image";
            imageAttachment.ContentType.Name = "png";
            imageAttachment.ContentDisposition = new ContentDisposition(ContentDisposition.Inline);
            imageAttachment.ContentType.Charset = null;

            bodyBuilder.HtmlBody = message.Replace("cid:qrcode", $"cid:{imageContentId}");
        }

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
