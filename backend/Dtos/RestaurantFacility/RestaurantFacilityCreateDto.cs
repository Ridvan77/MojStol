namespace backend.Dtos.RestaurantFacility
{
    public class RestaurantFacilityCreateDto
    {
        public int RestaurantID { get; set; }
        public int FacilitiesID { get; set; }
        public bool IsActive { get; set; }
    }
}