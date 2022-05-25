import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { validateAllFormFields } from '../../../../form-utils';
import { UserService } from '../user.service';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
})
export class InviteUserModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.createInviteUserForm();
  }

  createInviteUserForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email ]]
    })
  }

  dismiss(info?: { username: string, form: string }) {
    this.modalController.dismiss(info);
  }

  validateControl(controlName: string, error: string) {
    return this.form.get(controlName).hasError(error) && this.form.get(controlName).touched
  }

  submitForm() {
    if (this.form.valid) {
      this.dismiss(this.form.value);
    } else  {
        validateAllFormFields(this.form);
    }
    
  }

}
