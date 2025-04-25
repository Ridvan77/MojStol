import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  getErrorMessage(field: string): string {
    const control = this.f[field];
    if (control.hasError('required') && control.touched) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (field === 'email' && control.hasError('email') && control.touched) {
      return 'Please enter a valid email address';
    }

    return '';
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const mailtoLink = `mailto:mojstolhelp@gmail.com?subject=${encodeURIComponent(formValue.subject)}&body=${encodeURIComponent(
        `From: ${formValue.firstName} ${formValue.lastName}
Email: ${formValue.email}

Message:
${formValue.message}`
      )}`;

      window.location.href = mailtoLink;
      this.contactForm.reset();
      this.submitted = false;
    }
  }
}
