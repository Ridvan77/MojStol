using backend.Models;
using Services;

namespace backend.Helpers.DataSeeders
{
    public static class UserDataSeeder
    {
        public static List<User> GetUsers()
        {
            var passwordHelper = new PasswordHelper();

            var passwordAdmin = "AdminPass";
            var passwordUser = "UserPass";
            var passwordOwner = "OwnerPass";

            var (passwordHashAdmin, passwordSaltAdmin) = passwordHelper.CreatePasswordHash(passwordAdmin);
            var (passwordHashUser, passwordSaltUser) = passwordHelper.CreatePasswordHash(passwordUser);
            var (passwordHashOwner, passwordSaltOwner) = passwordHelper.CreatePasswordHash(passwordOwner);

            var users = new List<User>
            {
                new User
                {
                    UserId= -1,
                    Name = "Admin",
                    Surname = "Account",
                    Email = "mojstolhelp@gmail.com",
                    PasswordHash = passwordHashAdmin,
                    PasswordSalt = passwordSaltAdmin,
                    RoleId = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 1,
                    Name = "Amar",
                    Surname = "Omerovic",
                    Email = "amar.omerovic0607@gmail.com",
                    PasswordHash = passwordHashUser,
                    PasswordSalt = passwordSaltUser,
                    RoleId = 2,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 2,
                    Name = "Ridvan",
                    Surname = "Zolja",
                    Email = "ridvanzolja122@gmail.com",
                    PasswordHash = passwordHashUser,
                    PasswordSalt = passwordSaltUser,
                    RoleId = 2,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 3,
                    Name = "Adin",
                    Surname = "Jugo",
                    Email = "jugo.adin@gmail.com",
                    PasswordHash = passwordHashUser,
                    PasswordSalt = passwordSaltUser,
                    RoleId = 2,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 4,
                    Name = "Amar",
                    Surname = "Omerovic",
                    Email = "amar.omerovic@edu.fit.ba",
                    PasswordHash = passwordHashOwner,
                    PasswordSalt = passwordSaltOwner,
                    RoleId = 3,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 5,
                    Name = "Ridvan",
                    Surname = "Zolja",
                    Email = "zolja.ridvan@edu.fit.ba",
                    PasswordHash = passwordHashOwner,
                    PasswordSalt = passwordSaltOwner,
                    RoleId = 3,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 6,
                    Name = "Adin",
                    Surname = "Jugo",
                    Email = "adin.jugo@edu.fit.ba",
                    PasswordHash = passwordHashOwner,
                    PasswordSalt = passwordSaltOwner,
                    RoleId = 3,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 7,
                    Name = "Adil",
                    Surname = "Joldic",
                    Email = "adil+1@edu.fit.ba",
                    PasswordHash = passwordHashAdmin,
                    PasswordSalt = passwordSaltAdmin,
                    RoleId = 1,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 8,
                    Name = "Adil",
                    Surname = "Joldic",
                    Email = "adil+2@edu.fit.ba",
                    PasswordHash = passwordHashUser,
                    PasswordSalt = passwordSaltUser,
                    RoleId = 2,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    UserId = 9,
                    Name = "Adil",
                    Surname = "Joldic",
                    Email = "adil+3@edu.fit.ba",
                    PasswordHash = passwordHashOwner,
                    PasswordSalt = passwordHashOwner,
                    RoleId = 3,
                    IsActive = true,
                    TwoFactorEnabled = false,
                    CreatedAt = DateTime.UtcNow
                },
            };

            return users;
        }
    }
}
