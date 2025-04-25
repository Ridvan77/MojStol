using backend.Helpers.DataSeeders;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<City> Cities { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<RestaurantImage> RestaurantImages { get; set; }
        public DbSet<RestaurantType> RestaurantTypes { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
        public DbSet<MenuCategory> MenuCategories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<VisitAgain> VisitAgains { get; set; }
        public DbSet<Facilities> Facilities { get; set; }
        public DbSet<RestaurantFacilities> RestaurantFacilities { get; set; }
        public DbSet<SocialMedia> SocialMedias { get; set; }
        public DbSet<RestaurantSocialMedia> RestaurantSocialMedias { get; set; }
        public DbSet<ReviewVotes> ReviewVotes { get; set; }
        public DbSet<Favourites> Favourites { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<RestaurantTag> RestaurantTags { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<RestaurantPaymentMethod> RestaurantsPaymentMethod { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.UserId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<User>()
              .HasIndex(u => u.Email)
              .IsUnique();


            var roles = RoleDataSeeder.GetRoles();
            modelBuilder.Entity<Role>().HasData(roles);

            var users = UserDataSeeder.GetUsers();
            modelBuilder.Entity<User>().HasData(users);

            var cities = CityDataSeeder.GetCities();
            var restaurantsTypes = RestaurantTypeDataSeeder.GetRestaurantTypes();
            var restaurants = RestaurantDataSeeder.GetRestaurants(restaurantsTypes, users);
            var restaurantsWorkingHours = WorkingHoursDataSeeder.GetWorkingHours(restaurants);
            var restaurantsMenuCategories = MenuCategoryDataSeeder.GetMenuCategories(restaurants);
            var restaurantsMenuItems = MenuItemDataSeeder.GetMenuItems(restaurantsMenuCategories);
            var restaurantsTables = TableDataSeeder.GetTables(restaurants);
            var tags = TagDataSeeder.GetTags();
            var paymentMethods = PaymentMethodDataSeeder.GetPaymentMethods();
            var restaurantTags = RestaurantTagDataSeeder.GetRestaurantTags();
            var restaurantPaymentMethod = RestaurantPaymentMethodDataSeeder.GetRestaurantPaymentMethod();
            var socialMedias = SocialMediaDataSeeder.GetSocialMedias();
            var facilities = FacilityDataSeeder.GetFacilities();
            var restaurantSocialMedias = RestaurantSocialMediaDataSeeder.GetRestaurantSocialMedias();
            var restaurantFacilities = RestaurantFacilityDataSeeder.GetRestaurantFacilities();
            var statuses = StatusDataSeeder.GetStatuses();
            var reservations = ReservationDataSeeder.GetReservations(restaurants, restaurantsTables, statuses, users);
            var reviews = ReviewDataSeeder.GetReviews(restaurants, users).Item1;
            restaurants = ReviewDataSeeder.GetReviews(restaurants, users).Item2;



            modelBuilder.Entity<City>().HasData(cities);
            modelBuilder.Entity<RestaurantType>().HasData(restaurantsTypes);
            modelBuilder.Entity<Restaurant>().HasData(restaurants);
            modelBuilder.Entity<WorkingHours>().HasData(restaurantsWorkingHours);
            modelBuilder.Entity<MenuCategory>().HasData(restaurantsMenuCategories);
            modelBuilder.Entity<MenuItem>().HasData(restaurantsMenuItems);
            modelBuilder.Entity<Table>().HasData(restaurantsTables);
            modelBuilder.Entity<Tag>().HasData(tags);
            modelBuilder.Entity<PaymentMethod>().HasData(paymentMethods);
            modelBuilder.Entity<RestaurantTag>().HasData(restaurantTags);
            modelBuilder.Entity<RestaurantPaymentMethod>().HasData(restaurantPaymentMethod);
            modelBuilder.Entity<SocialMedia>().HasData(socialMedias);
            modelBuilder.Entity<Facilities>().HasData(facilities);
            modelBuilder.Entity<RestaurantSocialMedia>().HasData(restaurantSocialMedias);
            modelBuilder.Entity<RestaurantFacilities>().HasData(restaurantFacilities);
            modelBuilder.Entity<Status>().HasData(statuses);
            modelBuilder.Entity<Reservation>().HasData(reservations);
            modelBuilder.Entity<Review>().HasData(reviews);



            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }
        }
    }
}
