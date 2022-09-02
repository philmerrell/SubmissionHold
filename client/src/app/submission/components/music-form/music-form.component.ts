import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '../../../form-utils';
import { SubmissionService } from '../../submission.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../../environments/environment';
import { Festival } from '../../../admin/services/admin-festival.service';
import { Submission } from '../../../admin/services/submission.service';


@Component({
  selector: 'app-music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss'],
})
export class MusicFormComponent implements OnInit, OnChanges {
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

  constructor(private formBuilder: FormBuilder, private submissionService: SubmissionService) { }

  ngOnInit() {
    this.createSubmissionForm();
    this.states = this.submissionService.getStates();
    this.genres = this.submissionService.getGenres();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createSubmissionForm();
    if (changes.value?.currentValue) {
      this.setFormValue();
      this.showForm = true;
      this.imageDataUrl = null;
      this.imageFileName = null;
    } else {
      this.submissionForm.reset();
    }
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
  
        this.submissionService.uploadAsset(
          {
            uuid,
            mimeType: result.type,
            festivalId: this.festival.id,
            file: blob,
            fileName: name
          }
        )
        this.submissionForm.get('image').setValue(`${environment.s3ImageBucketUrl}/${this.festival.id}/${uuid}/${name}`);
      }

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

  private createVideosFormControl() {
    return this.formBuilder.control('')
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
      genres: [[], [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
      links: this.createLinksFormGroup(),
      statement: ['', Validators.required],
      contactInfo: this.createContactInfoFormGroup(),
      type: ['music', Validators.required],
      website: ['']
    });
  }

  private setFormValue() {
    this.removeVideosFormControl(0);
    for (let video of this.value.links.videos) {
      this.addVideosFormControl();
    }
    this.submissionForm.addControl('id', new FormControl(''));
    this.submissionForm.patchValue(this.value);
  }

  private createContactInfoFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      relationship: ['', Validators.required],
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

}
