using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.WorkingHours
{
    public class WorkingHoursUpdateDto
    {
        [Required(ErrorMessage = "Day of the week is required.")]
        public DayOfWeek Day { get; set; }

        [Required(ErrorMessage = "Open time is required.")]
        [Range(typeof(TimeOnly), "00:00", "23:59", ErrorMessage = "Open time must be between 00:00 and 23:59.")]
        public TimeOnly OpenTime { get; set; } = new TimeOnly(8, 0);

        [Required(ErrorMessage = "Close time is required.")]
        [Range(typeof(TimeOnly), "00:00", "23:59", ErrorMessage = "Close time must be between 00:00 and 23:59.")]
        public TimeOnly CloseTime { get; set; } = new TimeOnly(20, 0);

        public bool IsClosed { get; set; }
    }
}