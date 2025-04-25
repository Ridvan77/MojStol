using backend.Dtos.Table;
using backend.Models;

namespace backend.Mappers
{
    public static class TableMapper
    {
        public static TableDto ToTableDto(this Table tableModel)
        {
            return new()
            {
                Id = tableModel.Id,
                TableNumber = tableModel.TableNumber,
                Seats = tableModel.Seats,
                IsFunctional = tableModel.IsFunctional
            };
        }

        public static Table ToTableFromCreate(this TableCreateDto tableDto, int restuaurantId)
        {
            return new()
            {
                TableNumber = tableDto.TableNumber,
                Seats = tableDto.Seats,
                IsFunctional = tableDto.IsFunctional,
                RestaurantId = restuaurantId
            };
        }

        public static Table ToTableFromUpdate(this TableUpdateDto tableDto, int restuaurantId)
        {
            return new()
            {
                TableNumber = tableDto.TableNumber,
                Seats = tableDto.Seats,
                IsFunctional = tableDto.IsFunctional,
                RestaurantId = restuaurantId
            };
        }
    }
}
