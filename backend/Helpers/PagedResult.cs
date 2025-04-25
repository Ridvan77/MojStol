namespace backend.Helpers
{
    public class PagedResult<TModel>
    {
        public int? Count { get; set; }
        public IList<TModel> ResultList { get; set; }
    }
}
