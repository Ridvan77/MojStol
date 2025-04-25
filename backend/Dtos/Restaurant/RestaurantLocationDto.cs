﻿using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Restaurant
{
    public class RestaurantLocationDto
    {
        [Required(ErrorMessage = "Latitude is required.")]
        public double Latitude { get; set; }

        [Required(ErrorMessage = "Longitude is required.")]
        public double Longitude { get; set; }
    }
}