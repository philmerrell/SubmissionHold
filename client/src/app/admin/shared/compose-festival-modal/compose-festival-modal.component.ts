import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeChangeEventDetail, IonDatetime, ModalController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { validateAllFormFields } from '../../../form-utils';
import { Festival } from '../../services/admin-festival.service';


@Component({
  selector: 'app-compose-festival-modal',
  templateUrl: './compose-festival-modal.component.html',
  styleUrls: ['./compose-festival-modal.component.scss'],
})
export class ComposeFestivalModalComponent implements OnInit {
  @Input() festival: Festival;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.createForm();
    if (this.festival) {
      this.setFormValues();
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: null,
      name: ['', Validators.required],
      guidelines: [''],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      isActive: [false, Validators.required]
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  get startDateTime() {
    return this.form.get('startDateTime').value;
  }

  get endDateTime() {
    return this.form.get('endDateTime').value;
  }

  endDateTimeChange(event) {
    const newDateTime = event.detail.value;
    this.form.get('endDateTime').updateValueAndValidity;
    this.form.get('endDateTime').setValue(newDateTime);
  }

  setFormValues() {
    this.form.patchValue(this.festival);
  }
 
  startDateTimeChange(event) {
    console.log(event);
    const newDateTime = event.detail.value;
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
