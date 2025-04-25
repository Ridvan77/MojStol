using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Table
{
    public class TableCreateDto
    {
        [Required(ErrorMessage = "Table number is required.")]
        public int TableNumber { get; set; }

        [Range(1, 16, ErrorMessage = "Seats must be between 1 and 16.")]
        public int Seats { get; set; } = 4;

        public bool IsFunctional { get; set; } = true;
    }
}