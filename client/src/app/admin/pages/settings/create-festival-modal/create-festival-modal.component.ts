import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '../../../../form-utils';

@Component({
  selector: 'app-create-festival-modal',
  templateUrl: './create-festival-modal.component.html',
  styleUrls: ['./create-festival-modal.component.scss'],
})
export class CreateFestivalModalComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

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

  validateControl(controlName: string, error: string) {
    return this.form.get(controlName).hasError(error) && this.form.get(controlName).touched
  }

  async submitForm() {
    if (this.form.valid) {
      const submission = this.form.value;
      console.log(submission);
      // await this.submissionService.createSubmission(submission);
      // TODO: submit form values
    } else {
      validateAllFormFields(this.form);
    }
  }

}
