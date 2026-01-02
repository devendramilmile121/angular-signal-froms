import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { applyEach, email, Field, form, minLength, required } from '@angular/forms/signals';

interface Skill {
  name: string;
  proficiency: string;
}

interface UserRegistrationData {
  name: string;
  email: string;
  skills: Skill[];
}

@Component({
  selector: 'app-root',
  imports: [Field, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-signal-form');

  registrationModel = signal<UserRegistrationData>({
    name: '',
    email: '',
    skills: [{ name: '', proficiency: 'beginner' }],
  });

  // Create the form with validation schema
  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Validate name
    required(schemaPath.name, {
      message: 'Name is required',
    });
    minLength(schemaPath.name, 2, {
      message: 'Name must be at least 2 characters',
    });

    // Validate email
    required(schemaPath.email, {
      message: 'Email is required',
    });
    email(schemaPath.email, {
      message: 'Please enter a valid email address',
    });

    // Validate each skill in the array
    applyEach(schemaPath.skills, (skill) => {
      required(skill.name, {
        message: 'Skill name is required',
      });
      required(skill.proficiency, {
        message: 'Proficiency level is required',
      });
    });
  });

  // Add a new skill
  addSkill() {
    const currentSkills = this.registrationModel().skills;
    this.registrationModel.set({
      ...this.registrationModel(),
      skills: [...currentSkills, { name: '', proficiency: 'beginner' }],
    });
  }

  // Remove a skill
  removeSkill(index: number) {
    const currentSkills = this.registrationModel().skills;
    this.registrationModel.set({
      ...this.registrationModel(),
      skills: currentSkills.filter((_, i) => i !== index),
    });
  }

  // Handle form submission
  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.registrationForm().valid()) {
      const formData = this.registrationModel();
      console.log('Form submitted:', formData);

      // Here you would typically send data to your backend
      // await this.userService.register(formData);

      alert('Registration successful!');
    } else {
      alert('Please fix all errors before submitting');
    }
  }
}
