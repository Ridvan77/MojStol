using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public class TagDataSeeder
    {
        public static List<Tag> GetTags()
        {

            var tags = new List<Tag>
            {
                new Tag
                {
                    Name = "Happy hour"
                },
                new Tag
                {
                    Name = "Live Music"
                },
                new Tag
                {
                    Name = "Event"
                },
                new Tag
                {
                    Name = "Pet Friendly"
                },
                new Tag
                {
                    Name = "Outdor sitting"
                }
            };

            for (int i = 0; i < tags.Count; i++)
            {
                tags[i].TagID = i + 1;
            }


            return tags;
        }
    }
}
