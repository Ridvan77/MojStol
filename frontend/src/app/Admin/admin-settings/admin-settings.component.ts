import { Component, OnInit } from '@angular/core';
import { UserService, UserDto } from '../../Services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TagService, Tag, TagCreateDto } from '../../Services/tag.service';
import {
  PaymentMethod,
  PaymentMethodCreateDto,
  PaymentMethodService,
} from '../../Services/payment-method.service';
import { CityService, City } from '../../Services/city.service';
import {
  FacilitiesService,
  Facility,
  FacilityCreateDto,
} from '../../Services/facilities.service';
import {
  SocialMediasService,
  SocialMedia,
  SocialMediaCreateDto,
} from '../../Services/social-media.service';

@Component({
  selector: 'app-admin-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css',
})
export class AdminSettingsComponent implements OnInit {
  users: UserDto[] = [];
  roles: any[] = [];
  tags: Tag[] = [];
  paymentMethods: PaymentMethod[] = [];
  tagForm: FormGroup;
  paymentMethodForm: FormGroup;
  cities: City[] = [];
  cityForm: FormGroup;
  facilities: Facility[] = [];
  facilityForm: FormGroup;
  socialMedias: SocialMedia[] = [];
  socialMediaForm: FormGroup;

  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tagService: TagService,
    private router: Router,
    private fb: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private cityService: CityService,
    private facilitiesService: FacilitiesService,
    private socialMediaService: SocialMediasService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.tagForm = this.fb.group({
      tagName: ['', Validators.required],
    });
    this.paymentMethodForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.cityForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.facilityForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.socialMediaForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.loadTags();
    this.loadPaymentMethods();
    this.loadCities();
    this.loadFacilities();
    this.loadSocialMedias();
  }

  // ------------------------- User -------------------------
  fetchUsers(): void {
    const roleId = 1;
    this.userService.getAllUsers(null, roleId).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Error fetching users', error);
      },
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const registrationData = {
        ...formValue,
        roleID: 1,
      };

      console.log('Data: ', registrationData);

      this.authService.register(registrationData).subscribe(
        (response) => {
          alert('Registration successful!');
          this.router.navigate(['/admin/settings']);
          this.fetchUsers();
          this.registerForm.reset();
        },
        (error) => {
          console.error('Error during registration:', error);
          alert('Registration failed!');
        }
      );
    }
  }
  confirmDelete(userId: number, userName: string): void {
    if (confirm(`Are you sure you want to delete admin ${userName}?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.users = this.users.filter((user) => user.userId !== userId);
          alert('Admin successfully deleted');
        },
        error: (error) => {
          if (error.status === 200 || error.status === 204) {
            this.users = this.users.filter((user) => user.userId !== userId);
            alert('Admin successfully deleted');
          } else {
            console.error('Error deleting admin:', error);
            alert('Error deleting admin. Please try again.');
          }
        },
        complete: () => {
          this.fetchUsers();
        },
      });
    }
  }

  // ------------------------- Tag -------------------------
  loadTags(): void {
    this.tagService.getAllTags().subscribe(
      (data) => {
        this.tags = data;
        console.log('Tags loaded:', this.tags);
      },
      (error) => {
        console.error('Error loading tags', error);
      }
    );
  }
  createTag() {
    const tagData = this.tagForm.value;
    const tagCreateDto: TagCreateDto = {
      name: tagData.tagName,
    };

    this.tagService.createTag(tagCreateDto).subscribe(
      (response) => {
        alert('Tag created successfully!');
        console.log('Created tag:', response);
        this.loadTags();
        this.tagForm.reset();
      },
      (error) => {
        console.error('Error creating tag:', error);
        alert('Tag creation failed!');
      }
    );
  }
  confirmDeleteTag(tagId: number, tagName: string): void {
    console.log('Starting confirmDeleteTag with:', { tagId, tagName });

    if (!tagId) {
      console.error('TagId is undefined or null');
      return;
    }

    this.tagService.checkTagUsage(tagId).subscribe({
      next: (usageCount) => {
        console.log('CheckTagUsage response:', usageCount);
        let confirmMessage = `Are you sure you want to delete tag "${tagName}"?`;
        let forceDelete = false;

        if (usageCount > 0) {
          confirmMessage = `Tag "${tagName}" is used in ${usageCount} restaurants. Deleting it will remove it from all locations. Are you sure you want to proceed?`;
          forceDelete = true;
        }

        if (confirm(confirmMessage)) {
          this.deleteTag(tagId, forceDelete); // promjena iz tagID u tagId
          console.log('Proceeding with delete:', { tagId, forceDelete });
        }
      },
      error: (error) => {
        console.error('CheckTagUsage error:', error);
        if (error.status === 404) {
          alert('Tag not found.');
        } else if (error.status === 500) {
          alert('Server error occurred. Please try again later.');
        } else {
          alert('Error checking tag usage. Please try again.');
        }
      },
    });
  }
  private deleteTag(tagId: number, forceDelete: boolean): void {
    this.tagService.deleteTag(tagId, forceDelete).subscribe({
      next: (response) => {
        this.tags = this.tags.filter((tag) => tag.tagID !== tagId);
        alert('Tag successfully deleted');
      },
      error: (error) => {
        if (error.error?.message === 'Tag is in use') {
          alert('This tag is currently in use and cannot be deleted.');
        } else {
          console.error('Error deleting tag:', error);
          alert('Error deleting tag. Please try again.');
        }
      },
      complete: () => {
        this.loadTags();
      },
    });
  }

  // ------------------------- Payment Method -------------------------
  loadPaymentMethods(): void {
    this.paymentMethodService.getAll().subscribe(
      (data) => {
        this.paymentMethods = data;
        console.log('Payment methods:', this.paymentMethods);
      },
      (error) => {
        console.error('Error loading payment methods', error);
      }
    );
  }
  createPaymentMethod(): void {
    if (this.paymentMethodForm.valid) {
      const paymentMethodData = this.paymentMethodForm.value;

      const paymentMethodCreateDto: PaymentMethodCreateDto = {
        name: paymentMethodData.name,
      };

      this.paymentMethodService.create(paymentMethodCreateDto).subscribe(
        (response) => {
          alert('Payment method created successfully!');
          console.log('Created payment method:', response);
          this.loadPaymentMethods();
          this.paymentMethodForm.reset();
        },
        (error) => {
          console.error('Error creating payment method:', error);
          alert('Payment method creation failed!');
        }
      );
    } else {
      alert('Please fill in the payment method name.');
    }
  }
  confirmDeletePaymentMethod(
    paymentMethodId: number,
    paymentMethodName: string
  ): void {
    console.log('Starting confirmDeletePaymentMethod with:', {
      paymentMethodId,
      paymentMethodName,
    });

    if (!paymentMethodId) {
      console.error('PaymentMethodId is undefined or null');
      return;
    }

    this.paymentMethodService
      .checkPaymentMethodUsage(paymentMethodId)
      .subscribe({
        next: (isUsed) => {
          console.log('CheckPaymentMethodUsage response:', isUsed);
          let confirmMessage = `Are you sure you want to delete payment method "${paymentMethodName}"?`;

          if (isUsed) {
            confirmMessage = `Payment method "${paymentMethodName}" is used by some restaurants. Deleting it will remove it from all restaurants. Are you sure you want to proceed?`;
          }

          if (confirm(confirmMessage)) {
            this.deletePaymentMethod(paymentMethodId);
          }
        },
        error: (error) => {
          console.error('CheckPaymentMethodUsage error:', error);
          if (error.status === 404) {
            alert('Payment method not found.');
          } else if (error.status === 500) {
            alert('Server error occurred. Please try again later.');
          } else {
            alert('Error checking payment method usage. Please try again.');
          }
        },
      });
  }
  private deletePaymentMethod(paymentMethodId: number): void {
    this.paymentMethodService.delete(paymentMethodId).subscribe({
      next: () => {
        this.paymentMethods = this.paymentMethods.filter(
          (pm) => pm.paymentMethodID !== paymentMethodId
        );
        alert('Payment method successfully deleted');
      },
      error: (error) => {
        console.error('Error deleting payment method:', error);
        alert('Error deleting payment method. Please try again.');
      },
      complete: () => {
        this.loadPaymentMethods();
      },
    });
  }

  // ------------------------- City -------------------------
  loadCities(): void {
    this.cityService.getAll().subscribe({
      next: (data) => {
        this.cities = data.resultList;
        console.log('Cities loaded:', this.cities);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      },
    });
  }
  createCity(): void {
    if (this.cityForm.valid) {
      const cityData = this.cityForm.value;
      const cityDto: City = {
        id: '',
        name: cityData.name,
      };

      this.cityService.create(cityDto).subscribe({
        next: (response) => {
          alert('City created successfully!');
          console.log('Created city:', response);
          this.loadCities();
          this.cityForm.reset();
        },
        error: (error) => {
          console.error('Error creating city:', error);
          alert('City creation failed!');
        },
      });
    } else {
      alert('Please fill in the city name.');
    }
  }

  confirmDeleteCity(cityId: string, cityName: string): void {
    if (confirm(`Are you sure you want to delete city "${cityName}"?`)) {
      this.deleteCity(Number(cityId));
    }
  }

  private deleteCity(cityId: number): void {
    this.cityService.delete(cityId).subscribe({
      next: () => {
        this.cities = this.cities.filter(
          (city) => city.id !== cityId.toString()
        );
        alert('City successfully deleted');
      },
      error: (error) => {
        console.error('Error deleting city:', error);
        if (error.status === 404) {
          alert('City not found.');
        } else if (error.status === 500) {
          alert('Server error occurred. Please try again later.');
        } else {
          alert('Error deleting city. Please try again.');
        }
      },
      complete: () => {
        this.loadCities();
      },
    });
  }

  // Facilities methods
  loadFacilities(): void {
    this.facilitiesService.getAllFacilities().subscribe({
      next: (data) => {
        this.facilities = data;
        console.log('Facilities loaded:', this.facilities);
      },
      error: (error) => {
        console.error('Error loading facilities', error);
      },
    });
  }

  createFacility() {
    if (this.facilityForm.valid) {
      const facilityData: FacilityCreateDto = {
        name: this.facilityForm.value.name,
      };

      this.facilitiesService.createFacility(facilityData).subscribe({
        next: (response) => {
          alert('Facility created successfully!');
          this.loadFacilities();
          this.facilityForm.reset();
        },
        error: (error) => {
          console.error('Error creating facility:', error);
          alert('Facility creation failed!');
        },
      });
    }
  }

  confirmDeleteFacility(facilityId: number, facilityName: string): void {
    if (
      confirm(`Are you sure you want to delete facility "${facilityName}"?`)
    ) {
      this.deleteFacility(facilityId);
    }
  }

  private deleteFacility(facilityId: number): void {
    this.facilitiesService.deleteFacility(facilityId).subscribe({
      next: () => {
        this.facilities = this.facilities.filter(
          (f) => f.facilitiesID !== facilityId
        );
        alert('Facility successfully deleted');
      },
      error: (error) => {
        console.error('Error deleting facility:', error);
        alert('Error deleting facility. Please try again.');
      },
      complete: () => {
        this.loadFacilities();
      },
    });
  }

  // Social Media methods
  loadSocialMedias(): void {
    this.socialMediaService.getAllSocialMedias().subscribe({
      next: (data) => {
        this.socialMedias = data;
        console.log('Social medias loaded:', this.socialMedias);
      },
      error: (error) => {
        console.error('Error loading social medias', error);
      },
    });
  }

  createSocialMedia() {
    if (this.socialMediaForm.valid) {
      const socialMediaData: SocialMediaCreateDto = {
        name: this.socialMediaForm.value.name,
      };

      this.socialMediaService.createSocialMedia(socialMediaData).subscribe({
        next: (response) => {
          alert('Social media created successfully!');
          this.loadSocialMedias();
          this.socialMediaForm.reset();
        },
        error: (error) => {
          console.error('Error creating social media:', error);
          alert('Social media creation failed!');
        },
      });
    }
  }

  confirmDeleteSocialMedia(
    socialMediaId: number,
    socialMediaName: string
  ): void {
    if (
      confirm(
        `Are you sure you want to delete social media "${socialMediaName}"?`
      )
    ) {
      this.deleteSocialMedia(socialMediaId);
    }
  }

  private deleteSocialMedia(socialMediaId: number): void {
    this.socialMediaService.deleteSocialMedia(socialMediaId).subscribe({
      next: () => {
        this.socialMedias = this.socialMedias.filter(
          (sm) => sm.socialMediaID !== socialMediaId
        );
        alert('Social media successfully deleted');
      },
      error: (error) => {
        console.error('Error deleting social media:', error);
        alert('Error deleting social media. Please try again.');
      },
      complete: () => {
        this.loadSocialMedias();
      },
    });
  }
}
