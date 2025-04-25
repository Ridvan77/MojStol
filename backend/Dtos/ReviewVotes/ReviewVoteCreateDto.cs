namespace backend.Dtos.ReviewVotes
{
    public class ReviewVotesCreateDto
    {
        public int UserID { get; set; }
        public int ReviewID { get; set; }
        public bool IsLike { get; set; }
    }
}