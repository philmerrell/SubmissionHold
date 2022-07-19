import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Festival } from '../../../admin/services/admin-festival.service';
import { validateAllFormFields } from '../../../form-utils';
import { SubmissionService } from '../../submission.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-general-fort-form',
  templateUrl: './general-fort-form.component.html',
  styleUrls: ['./general-fort-form.component.scss'],
})
export class GeneralFortFormComponent implements OnInit {
  @Input() submissionPending: boolean;
  @Input() festival: Festival;
  @Output() submit = new EventEmitter<any>();
  genres: string[];
  imageDataUrl;
  imageFileName;
  showForm: boolean;
  showRequiredFieldsMissingWarning: boolean;
  states: { label: string, value: string }[];
  submissionForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private submissionService: SubmissionService) { }

  ngOnInit() {
    this.createSubmissionForm();
    this.states = this.submissionService.getStates();
  }

  private createSubmissionForm() {
    this.submissionForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['United States', Validators.required],
      isInternational: [false],
      description: ['', Validators.required],
      image: ['', Validators.required],
      genres: [[]],
      links: this.createLinksFormGroup(),
      statement: [''],
      contactInfo: this.createContactInfoFormGroup(),
      type: ['music', Validators.required],
      website: ['']
    });
  }

  private createContactInfoFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      relationship: [''],
      managementContact: [''],
      agentContact: [''],
      publicityContact: [''],
      labelContact: ['']
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
      videos: this.formBuilder.array([this.createVideosFormControl()])
    });
  }

  private createVideosFormControl() {
    return this.formBuilder.control('')
  }

  private async getDataUrl(result: File) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = event.target.result;
        resolve(data);
      };
      reader.readAsDataURL(result);
    });
  }

  private async getBlobFromFile(result: File) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = event.target.result;
        resolve(data);
      };
      reader.readAsArrayBuffer(result);
    });
  }

  private removeEmptyVideoLinks(submission: any) {
    submission.links.videos = submission.links.videos.filter(v => v !== '');
  }

  async addFile(event) {
    if (event) {
      const result = event.target.files[0];
      const blob = await this.getBlobFromFile(result);
      this.imageDataUrl = await this.getDataUrl(result);
      this.imageFileName = result.name;
      const uuid = uuidv4();

      this.submissionService.uploadAsset(
        {
          uuid,
          mimeType: result.type,
          festivalId: this.festival.id,
          file: blob,
          fileName: result.name
        }
      )
      this.submissionForm.get('image').setValue(`${environment.s3ImageBucketUrl}/${this.festival.id}/${uuid}/${this.imageFileName}`);
    }
  }

  getIsInternational() {
    return this.submissionForm.get('isInternational').value
  }

  handleIsInternational(event) {
    const isInternational = event.detail.checked;
    if (isInternational) {
      this.submissionForm.get('country').setValue('');
      this.submissionForm.get('state').setValue('');
      this.submissionForm.get('state').clearValidators();
      this.submissionForm.get('state').updateValueAndValidity();
    } else {
      this.submissionForm.get('state').setValidators(Validators.required);
      this.submissionForm.get('country').setValue('United States');
    }
  }

  validateControl(controlName: string, error: string) {
    return this.submissionForm.get(controlName).hasError(error) && this.submissionForm.get(controlName).touched
  }

  validateLocationControl(controlName: string, error: string) {
    return this.submissionForm.get(controlName).hasError(error) && this.submissionForm.get(controlName).touched;
  }

  async submitForm() {
    console.log(this.submissionForm);
    if (this.submissionForm.valid) {
      const submission = this.submissionForm.value;
      this.removeEmptyVideoLinks(submission);
      this.submit.emit(submission);
    } else {
      validateAllFormFields(this.submissionForm);
      this.showRequiredFieldsMissingWarning = true;
    }
  }

  addVideosFormControl() {
    const videosFormArray = this.submissionForm.get('links.videos') as FormArray;
    videosFormArray.push(this.createVideosFormControl());
  }

  removeVideosFormControl(i: number) {
    const videosFormArray = this.submissionForm.get('links.videos') as FormArray;
    videosFormArray.removeAt(i);
  }

  getVideosFormArray(form: FormGroup) {
    const control =  form.get('links.videos')['controls']
    return control;
  }

}
