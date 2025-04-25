namespace backend.Dtos.WorkingHours
{
    public class WorkingHoursDto
    {
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeOnly OpenTime { get; set; }
        public TimeOnly CloseTime { get; set; }
        public bool IsClosed { get; set; }
    }
}
