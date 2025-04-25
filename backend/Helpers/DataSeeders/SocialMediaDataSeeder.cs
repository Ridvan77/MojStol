using Models;

namespace backend.Helpers.DataSeeders
{
    public static class SocialMediaDataSeeder
    {
        public static List<SocialMedia> GetSocialMedias()
        {
            var socialMedias = new List<SocialMedia>
            {
                new() { Name = "Facebook" },
                new() { Name = "Instagram" },
                new() { Name = "TikTok" }
            };

            for (int i = 0; i < socialMedias.Count; i++)
            {
                socialMedias[i].SocialMediaID = i + 1;
            }

            return socialMedias;
        }
    }
}
