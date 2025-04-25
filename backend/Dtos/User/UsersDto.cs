namespace backend.Dtos.User
{
    public class UsersDto
    {
            public int UserId { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Email { get; set; }
            public bool IsActive { get; set; }
            public DateTime CreatedAt { get; set; }
            public string? PhoneNumber { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public int RoleId { get; set; }


    }
}
