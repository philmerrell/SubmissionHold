import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeChangeEventDetail, IonDatetime, ModalController } from '@ionic/angular';
import { validateAllFormFields } from '../../../../form-utils';

@Component({
  selector: 'app-create-festival-modal',
  templateUrl: './create-festival-modal.component.html',
  styleUrls: ['./create-festival-modal.component.scss'],
})
export class CreateFestivalModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      guidelines: [''],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
  }

  get startDateTime() {
    return this.form.get('startDateTime').value;
  }

  get endDateTime() {
    return this.form.get('endDateTime').value;
  }

  endDateTimeChange(event: any) {
    const newDateTime = event.target.detail;
    this.form.get('endDateTime').updateValueAndValidity;
    this.form.get('endDateTime').setValue(newDateTime);
  }
 
  startDateTimeChange(event: any) { 
    const newDateTime = event.target.detail;
    this.form.get('startDateTime').updateValueAndValidity;
    this.form.get('startDateTime').setValue(newDateTime);
  }

  validateControl(controlName: string, error: string) {
    return this.form.get(controlName).hasError(error) && this.form.get(controlName).touched
  }

  async submitForm() {
    if (this.form.valid) {
      const festival = this.form.value;
      this.modalController.dismiss(festival);
    } else {
      validateAllFormFields(this.form);
    }
  }

}
