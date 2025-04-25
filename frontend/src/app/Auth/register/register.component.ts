import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { RoleService } from '../../Services/role.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-register',
    imports: [RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles: any[] = [];
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleID: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe(
      (data) => {
        this.roles = data;
        //console.log(this.roles);
      },
      (error) => {
        console.error('Error fetching roles:', error);
        alert('Failed to load roles.');
      }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const registrationData = {
        ...formValue,
        roleID: formValue.roleID,  // Change roleId to roleID
      };

      //console.log(registrationData);

      // Call the register API with the updated form data
      this.authService.register(registrationData).subscribe(
        (response) => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error during registration:', error);
          alert('Registration failed!');
        }
      );
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}