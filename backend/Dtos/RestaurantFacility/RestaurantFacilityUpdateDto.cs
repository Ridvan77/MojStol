namespace backend.Dtos.RestaurantFacility
{
    public class RestaurantFacilityUpdateDto
    {
        public int? RestaurantID { get; set; }
        public int? FacilitiesID { get; set; }
        public bool? IsActive { get; set; }
    }
}