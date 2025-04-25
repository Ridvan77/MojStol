public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string message, byte[] attachment = null, string attachmentName = null);
}