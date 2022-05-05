import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '../form-utils';
import { SubmissionService } from './submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {
  submissionForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private submissionService: SubmissionService) { }

  ngOnInit() {
    this.createSubmissionForm();
  }

  getIsInternational() {
    return this.submissionForm.get('location').get('isInternational').value;
  }

  handleIsInternational(event) {
    const isInternational = event.detail.checked;
    if (isInternational) {
      this.submissionForm.get('location').get('country').setValue('');
      this.submissionForm.get('location').get('state').setValue('');
      this.submissionForm.get('location').get('state').clearValidators();
      this.submissionForm.get('location').get('state').updateValueAndValidity();
    } else {
      this.submissionForm.get('location').get('state').setValidators(Validators.required);
      this.submissionForm.get('location').get('country').setValue('United States');
    }
  }

  validateControl(controlName: string, error: string) {
    return this.submissionForm.get(controlName).hasError(error) && this.submissionForm.get(controlName).touched
  }

  validateLocationControl(controlName: string, error: string) {
    return this.submissionForm.get('location').get(controlName).hasError(error) && this.submissionForm.get('location').get(controlName).touched;
  }

  async submitForm() {
    if (this.submissionForm.valid) {
      const submission = this.submissionForm.value;
      console.log(submission);
      await this.submissionService.createSubmission(submission);
      // TODO: submit form values
    } else {
      validateAllFormFields(this.submissionForm);
    }
  }

  addYoutubeFormControl() {
    const youtubeFormArray = this.submissionForm.get('links.youtube') as FormArray;
    youtubeFormArray.push(this.createYoutubeFormControl());
  }

  removeYoutubeFormControl(i: number) {
    const youtubeFormArray = this.submissionForm.get('links.youtube') as FormArray;
    youtubeFormArray.removeAt(i);
  }

  getYoutubeFormArray(form: FormGroup) {
    const control =  form.get('links.youtube')['controls']
    return control;
  }

  private createYoutubeFormControl() {
    return this.formBuilder.group({
      url: ['']
    })
  }

  private createSubmissionForm() {
    this.submissionForm = this.formBuilder.group({
      bio: ['', Validators.required],
      contacts: this.createContactsFormGroup(),
      genres: [[]],
      image: [''],
      location: this.createLocationFormGroup(),
      links: this.createLinksFormGroup(),
      memberNames: ['', Validators.required],
      name: ['', Validators.required],
      numberOfMembers: ['', Validators.required],
      statement: ['', Validators.required],
      submitter: this.createSubmitterInfoFormGroup(),
      website: ['']
    });
  }

  private createContactsFormGroup(): FormGroup {
    return this.formBuilder.group({
      management: [''],
      agent: [''],
      publicity: [''],
      label: ['']
    });
  }

  private createSubmitterInfoFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      relationship: ['', Validators.required]
    });
  }

  private createLinksFormGroup(): FormGroup {
    return this.formBuilder.group({
      spotify: '',
      appleMusic: '',
      bandcamp: '',
      soundcloud: '',
      facebook: '',
      twitter: '',
      tiktok: '',
      youtube: this.formBuilder.array([this.createYoutubeFormControl()]),
      website: ''
    });
  }

  private createLocationFormGroup(): FormGroup {
    return this.formBuilder.group({
      isInternational: false,
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['United States', Validators.required]
    });
  }

}
