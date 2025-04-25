using backend.Dtos.City;
using backend.Models;

namespace backend.Mappers
{
    public static class CityMapper
    {
        public static CityDto ToCityDto(this City CityModel)
        {
            return new()
            {
                Id = CityModel.Id,
                Name = CityModel.Name
            };
        }

        public static City ToCityFromCreate(this CityCreateDto CityDto)
        {
            return new()
            {
                Name = CityDto.Name.Trim()
            };
        }

        public static City ToCityFromUpdate(this CityUpdateDto CityDto)
        {
            return new()
            {
                Name = CityDto.Name.Trim()
            };
        }
    }
}
