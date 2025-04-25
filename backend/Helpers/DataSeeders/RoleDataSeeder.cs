using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public class RoleDataSeeder
    {
        public static List<Role> GetRoles()
        {
            var roles = new List<Role>
            {
                new Role { RoleID = 1, Name = "Admin" },
                new Role { RoleID = 2, Name = "User" },
                new Role { RoleID = 3, Name = "Owner" }
            };

            return roles;
        }
    }
}
