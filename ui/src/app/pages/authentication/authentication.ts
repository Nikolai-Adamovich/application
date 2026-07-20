import { Component, signal } from '@angular/core';
import { type WritableSignal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required, schema, validate } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

interface LoginModel {
  email: string;
  password: string;
}

interface RegisterModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'ui-authentication',
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss',
  imports: [FormField, FormRoot, HlmButtonImports, HlmCardImports, HlmFieldImports, HlmInputImports, HlmTabsImports],
})
export default class Authentication {
  protected readonly activeTab = signal<'login' | 'register'>('login');
  // --- Login form ---
  private readonly loginModel: WritableSignal<LoginModel> = signal({ email: '', password: '' });
  protected readonly loginForm = form(
    this.loginModel,
    schema<LoginModel>((field) => {
      required(field.email, { message: 'Email is required.' });
      email(field.email, { message: 'Please enter a valid email address.' });
      required(field.password, { message: 'Password is required.' });
      minLength(field.password, 8, { message: 'Password must be at least 8 characters.' });
    }),
    {
      submission: {
        action: async () => {
          const { email, password } = this.loginModel();

          console.warn('Login submitted', { email, password });
        },
      },
    },
  );
  // --- Register form ---
  private readonly registerModel: WritableSignal<RegisterModel> = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  private readonly registerModelRef = this.registerModel;
  protected readonly registerForm = form(
    this.registerModel,
    schema<RegisterModel>((field) => {
      required(field.name, { message: 'Name is required.' });
      required(field.email, { message: 'Email is required.' });
      email(field.email, { message: 'Please enter a valid email address.' });
      required(field.password, { message: 'Password is required.' });
      minLength(field.password, 8, { message: 'Password must be at least 8 characters.' });
      required(field.confirmPassword, { message: 'Please confirm your password.' });
      validate(field.confirmPassword, ({ value }) => {
        if (value() !== this.registerModelRef().password) {
          return { kind: 'passwordMismatch', message: 'Passwords do not match.' };
        }
        return undefined;
      });
    }),
    {
      submission: {
        action: async () => {
          const { name, email, password } = this.registerModel();

          console.warn('Register submitted', { name, email, password });
          this.activeTab.set('login');
        },
      },
    },
  );
}
