namespace backend.Helpers.QueryObjects
{
    public class RestaurantQueryObject
    {
        public string? RestaurantName { get; set; }
        public string? SortBy { get; set; }
        public bool IsDecsending { get; set; }
        public int RestaurantTypeId { get; set; }
        public int CityId { get; set; }
        public int OwnerId { get; set; }

        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public List<int>? TagIds { get; set; }
        public List<int>? PaymentMethodIds { get; set; }
        public List<int>? FacilityIds { get; set; }

    }
}
