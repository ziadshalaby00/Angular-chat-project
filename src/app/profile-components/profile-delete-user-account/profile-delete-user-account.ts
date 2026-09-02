import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

import {
  form,
  FormField,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

import { AuthApi, UserDataType } from '../../services/auth-services/auth-api';

import {
  Modal,
  Input,
  Button,
} from '@ziadshalaby/ngx-zs-component';


@Component({
  selector: 'app-profile-delete-user-account',
  imports: [
    Modal,
    Input,
    Button,
    FormField
  ],
  templateUrl: './profile-delete-user-account.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile-delete-user-account.css',
})
export class ProfileDeleteUserAccount {

  // ============================================================================
  // Dependencies
  // ============================================================================

  readonly authApi = inject(AuthApi);


  // ============================================================================
  // Inputs / Models
  // ============================================================================

  readonly profileData = input<UserDataType | null>(null);

  readonly openDelUserAccModal = model<boolean>(false);


  // ============================================================================
  // Delete Account Steps
  // ============================================================================

  readonly step = signal<1 | 2>(1);


  // ============================================================================
  // Form
  // ============================================================================

  readonly deleteAccountModel = signal({
    confirmation: '',
    password: '',
  });


  readonly deleteAccountForm = form(this.deleteAccountModel, (schema) => {
    required(schema.confirmation, {message: 'confirmation is required.'});
    required(schema.password, {message: 'password is required.'});

    // --------------------------------------------------------------------------
    // Confirmation validation
    // --------------------------------------------------------------------------

    validate(schema.confirmation, (ctx) => {

      const username = this.profileData()?.username;

      if (!username) {
        return null;
      }

      const expectedValue = `Delete ${username}`;

      if (ctx.value() !== expectedValue) {
        return {
          kind: 'confirmationMismatch',
          message: `Please type "${expectedValue}" to continue.`,
        };
      }

      return null;
    });
  });


  // ============================================================================
  // Reset Modal
  // ============================================================================

  constructor() {
    effect(() => {
      const isOpen = this.openDelUserAccModal();
      if (!isOpen) {
        this.resetDeleteAccount();
      }
    });
  }


  // ============================================================================
  // Step 1 → Step 2
  // ============================================================================

  continueDelete(): void {

    const form = this.deleteAccountForm;

    // Make sure confirmation field is valid
    if (!form.confirmation().valid()) {
      return;
    }

    this.step.set(2);
  }


  // ============================================================================
  // Step 2 → Delete Account
  // ============================================================================

  DeleteAcc(): void {

    const form = this.deleteAccountForm;

    // Validate the whole form
    if (form().invalid()) {
      return;
    }

    const password = form.password().value();

    if (!password) {
      return;
    }

    // Prevent duplicate requests
    if (this.authApi.deleteAccLoading()) {
      return;
    }

    this.authApi.deleteAccLoading.set(true);
    this.authApi.deleteAcc(password);
  }

  // ============================================================================
  // Reset
  // ============================================================================

  private resetDeleteAccount(): void {
    this.step.set(1);

    this.deleteAccountModel.set({
      confirmation: '',
      password: '',
    });
  }
}