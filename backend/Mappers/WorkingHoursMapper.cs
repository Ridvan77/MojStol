using backend.Dtos.WorkingHours;
using backend.Models;

namespace backend.Mappers
{
    public static class WorkingHoursMapper
    {

        public static WorkingHoursDto ToWorkingHoursDto(this WorkingHours workingHoursModel)
        {
            return new()
            {
                Id = workingHoursModel.Id,
                Day = workingHoursModel.Day,
                OpenTime = workingHoursModel.OpenTime,
                CloseTime = workingHoursModel.CloseTime,
                IsClosed = workingHoursModel.IsClosed
            };
        }


        public static WorkingHours ToWorkingHoursFromCreate(this WorkingHoursCreateDto workingHoursDto, int restuaurantId)
        {
            return new()
            {
                Day = workingHoursDto.Day,
                OpenTime = workingHoursDto.OpenTime,
                CloseTime = workingHoursDto.CloseTime,
                IsClosed = workingHoursDto.IsClosed,
                RestaurantId = restuaurantId
            };
        }

        public static WorkingHours ToWorkingHoursFromUpdate(this WorkingHoursUpdateDto workingHoursDto, int restuaurantId)
        {
            return new()
            {
                Day = workingHoursDto.Day,
                OpenTime = workingHoursDto.OpenTime,
                CloseTime = workingHoursDto.CloseTime,
                IsClosed = workingHoursDto.IsClosed,
                RestaurantId = restuaurantId
            };
        }
    }
}
