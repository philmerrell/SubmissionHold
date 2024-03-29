import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Festival } from '../../../admin/services/admin-festival.service';
import { validateAllFormFields } from '../../../form-utils';
import { SubmissionService } from '../../submission.service';
import { v4 as uuidv4 } from 'uuid';
import { Submission } from '../../../admin/services/submission.service';

@Component({
  selector: 'app-general-fort-form',
  templateUrl: './general-fort-form.component.html',
  styleUrls: ['./general-fort-form.component.scss'],
})
export class GeneralFortFormComponent implements OnInit, OnChanges {
  @Input() submissionPending: boolean;
  @Input() festival: Festival;
  @Input() value: Submission;
  @Output() submit = new EventEmitter<any>();
  genres: string[];
  imageDataUrl;
  imageFileName;
  showForm: boolean;
  showRequiredFieldsMissingWarning: boolean;
  states: { label: string, value: string }[];
  submissionForm: FormGroup;
  isInternational: any;
  
  constructor(private formBuilder: FormBuilder, private submissionService: SubmissionService) { }

  ngOnInit() {
    this.states = this.submissionService.getStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createSubmissionForm();
    this.subscribeToIsInternationalChanges();
    if(changes.value?.currentValue) {
      this.setFormValue();
      this.imageDataUrl = null;
      this.imageFileName = null;
    } else {
      this.submissionForm.reset()
    }
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
      statement: ['', Validators.required],
      contactInfo: this.createContactInfoFormGroup(),
      website: ['']
    });
  }

  private setFormValue() {
    this.removeVideosFormControl(0);
    for (let video of this.value.links.videos) {
      this.addVideosFormControl();
    }
    this.submissionForm.addControl('id', new FormControl(''));
    if (this.value.country !== 'United States') {
      this.submissionForm.controls.isInternational.setValue(true);
    }
    this.submissionForm.patchValue(this.value, { emitEvent: true });
    console.log(this.value);
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
      instagram: '',
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

      if (result.size > 2097152) { 
        alert("File is too big! Must be 2MB or less.");
      } else {
        const blob = await this.getBlobFromFile(result);
        this.imageDataUrl = await this.getDataUrl(result);
        this.imageFileName = result.name;
        const uuid = uuidv4();
        const name = uuidv4();

        await this.submissionService.uploadAsset(
          {
            uuid,
            mimeType: result.type,
            festivalId: this.festival.id,
            file: blob,
            fileName: name
          }
        )
        this.submissionForm.get('image').setValue(`${environment.s3ImageBucketUrl}/${this.festival.id}/${uuid}/${name}`);
        // this.imageDataUrl = false;
      }
    }
  }

  validateControl(controlName: string, error: string) {
    return this.submissionForm.get(controlName).hasError(error) && this.submissionForm.get(controlName).touched
  }

  validateLocationControl(controlName: string, error: string) {
    return this.submissionForm.get(controlName).hasError(error) && this.submissionForm.get(controlName).touched;
  }

  async submitForm() {
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

  private subscribeToIsInternationalChanges() {
    this.submissionForm.controls.isInternational.valueChanges.subscribe(result => {
      this.handleIsInternational(result);
    });
  }

  handleIsInternational(isInternational) {
    this.isInternational = isInternational;
    if (isInternational) {
      this.submissionForm.get('country').setValue('');
      this.submissionForm.get('state').setValue('');
      this.submissionForm.get('state').clearValidators();
      this.submissionForm.get('state').updateValueAndValidity();
    } else {
      this.submissionForm.get('state').setValidators(Validators.required);
      this.submissionForm.get('country').setValue('United States');
      this.submissionForm.get('state').updateValueAndValidity();
    }
  }

}
