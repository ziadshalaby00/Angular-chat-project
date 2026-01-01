import { Component, effect, inject, input, model, signal, WritableSignal } from '@angular/core';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';
import { ChangeEventType, Modal, Input, Button } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-profile-delete-user-account',
  imports: [Modal, Input, Button],
  templateUrl: './profile-delete-user-account.html',
  styleUrl: './profile-delete-user-account.css',
})
export class ProfileDeleteUserAccount {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly profileData = input<UserDataType | null>(null);
  
  readonly openDelUserAccModal = model<boolean>(false);

  constructor() {
    effect(() => {
      const openDelUserAccModal = this.openDelUserAccModal()
      if(!openDelUserAccModal) {
        this.step.set(1);
        this.del_Username.set({ value: '', valid: false, fromForce: false });
        this.passForDA.set({ value: '', valid: false, fromForce: false });
        this.ddToCnSTouch.set(false);
        this.passForDATouch.set(false);
      }
    })
  }

  // ================================= Delete User Account ================================= //
  readonly step = signal<1 | 2>(1);

  readonly del_UsernameValdate = (value: string | null) => {
    if(value !== `Delete ${this.authApi.userData()?.username}`) {
      return ['Pls enter `Delete + username`'];
    }
    return [];
  }

  readonly del_Username = signal<ChangeEventType>({
    value: '',
    valid: false,
    fromForce: false
  });
  readonly ddToCnSTouch = signal<boolean>(false);

  setDel_Username(event: ChangeEventType) {
    this.del_Username.set(event);
  }

  continueDelete() {
    if(this.del_Username().valid) {
      this.step.set(2)
    }else {
      this.ddToCnSTouch.set(true);
    }
  }

  readonly passForDA = signal<ChangeEventType>({
    value: '',
    valid: false,
    fromForce: false
  });
  readonly passForDATouch = signal<boolean>(false);

  setPassForDA(event: ChangeEventType) {
    this.passForDA.set(event);
  }

  DeleteAcc() {
    if(this.passForDA().valid) {
      this.authApi.deleteAccLoading.set(true);
      this.authApi.deleteAcc(this.passForDA().value ?? '')
    }else {
      this.passForDATouch.set(true);
    }
  }
  // =================================/ Delete User Account /================================= //
}
