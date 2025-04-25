using SkiaSharp;

namespace backend.Helpers
{
    public static class ImageHelper
    {
        public static byte[] ParseBase64(this string base64String)
        {
            if (base64String.Contains("base64,"))
            {
                base64String = base64String.Split("base64,")[1];
            }

            return Convert.FromBase64String(base64String);
        }

        public static byte[]? ResizeImage(byte[] imageBytes, int size, int quality = 75)
        {
            using var input = new MemoryStream(imageBytes);
            using var inputStream = new SKManagedStream(input);
            using var original = SKBitmap.Decode(inputStream);
            int width, height;
            if (original.Width > original.Height)
            {
                width = size;
                height = original.Height * size / original.Width;
            }
            else
            {
                width = original.Width * size / original.Height;
                height = size;
            }
            //SKFilterQuality.High
            using var resized = original
                .Resize(new SKImageInfo(width, height), SKSamplingOptions.Default);
            if (resized == null) return null;

            using var image = SKImage.FromBitmap(resized);
            return image.Encode(SKEncodedImageFormat.Jpeg, quality)
                .ToArray();
        }
    }
}
