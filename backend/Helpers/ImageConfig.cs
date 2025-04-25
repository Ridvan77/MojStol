namespace backend.Helpers
{
    public class ImageConfig
    {
        public static string AppUrl = "http://localhost:5137/";

        public static string Images => "restaurant_images";
        public static string ImagesUrl => AppUrl + Images;
        public static string ImagesFolder => "wwwroot/" + Images;

        public static string Logos => "restaurant_logos";
        public static string LogosUrl => AppUrl + Logos;
        public static string LogosFolder => "wwwroot/" + Logos;
    }
}
