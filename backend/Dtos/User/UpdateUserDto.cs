﻿namespace backend.Dtos.User
{
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
