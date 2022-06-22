import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '../../../form-utils';
import { SubmissionService } from '../../submission.service';

@Component({
  selector: 'app-music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss'],
})
export class MusicFormComponent implements OnInit {
  @Input() submissionPending: boolean;
  @Output() submit = new EventEmitter<any>();
  submissionForm: FormGroup;
  imageDataUrl;
  imageFileName;
  showForm: boolean;
  states: { label: string, value: string }[];

  constructor(private formBuilder: FormBuilder, private submissionService: SubmissionService) { }

  ngOnInit() {
    this.createSubmissionForm();
    this.states = this.getStates();
  }

  async addFile(event) {
    if (event) {
      const result = event.target.files[0];
      const blob = await this.getBlobFromFile(result);
      this.imageDataUrl = await this.getDataUrl(result);
      this.imageFileName = result.name;
      console.log(result);
    }
    // this.modalController.dismiss({
    //   path: dataUrl,
    //   result: {
    //     folderPath: '/',
    //     asset: {
    //       mimeType: result.type,
    //       file: blob,
    //       fileName: 'Profile',
    //       fileSize: result.size
    //     }
    //   }
    // });
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
      this.submit.emit(submission);
    } else {
      validateAllFormFields(this.submissionForm);
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
      fort: ['music', Validators.required],
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['United States', Validators.required],
      isInternational: [false],
      description: ['', Validators.required],
      image: [''],
      genres: [[]],
      links: this.createLinksFormGroup(),
      statement: ['', Validators.required],
      contactInfo: this.createContactInfoFormGroup(),
      type: ['music', Validators.required],
      website: ['']
      // numberOfMembers: ['', Validators.required],
      // memberNames: ['', Validators.required],
      // contacts: this.createContactsFormGroup(),
    });
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

  private getStates() {
    return [
      { 'label':'Alabama', 'value': 'AL' },
      { 'label':'Alaska', 'value': 'AK'},
      { 'label':'Arizona', 'value': 'AZ'},
      { 'label':'Arkansas', 'value': 'AR'},
      { 'label':'California', 'value': 'CA'},
      { 'label':'Colorado', 'value': 'CO'},
      { 'label':'Connecticut', 'value': 'CT'},
      { 'label':'Delaware', 'value': 'DE'},
      { 'label':'Florida', 'value': 'FL'},
      { 'label':'Georgia', 'value': 'GA' },
      { 'label':'Hawaii', 'value': 'HI'},
      { 'label':'Idaho', 'value': 'ID'},
      { 'label':'Illinois', 'value': 'IL'},
      { 'label':'Indiana', 'value': 'IN'},
      { 'label':'Iowa', 'value': 'IA'},
      { 'label':'Kansas', 'value': 'KS'},
      { 'label':'Kentucky', 'value': 'KY'},
      { 'label':'Louisiana', 'value': 'LA'},
      { 'label':'Maine', 'value': 'ME'},
      { 'label':'Maryland', 'value': 'MD'},
      { 'label':'Massachusetts', 'value': 'MA'},
      { 'label':'Michigan', 'value': 'MI'},
      { 'label':'Minnesota', 'value': 'MN'},
      { 'label':'Mississippi', 'value': 'MS'},
      { 'label':'Missouri', 'value': 'MO'},
      { 'label':'Montana', 'value': 'MT'},
      { 'label':'Nebraska', 'value': 'NE'},
      { 'label':'Nevada', 'value': 'NV'},
      { 'label':'New Hampshire', 'value': 'NH'},
      { 'label':'New Jersey', 'value': 'NJ'},
      { 'label':'New Mexico', 'value': 'NM'},
      { 'label':'New York', 'value': 'NY'},
      { 'label':'North Carolina', 'value': 'NC'},
      { 'label':'North Dakota', 'value': 'ND'},
      { 'label':'Ohio', 'value': 'OH'},
      { 'label':'Oklahoma', 'value': 'OK'},
      { 'label':'Oregan', 'value': 'OR'},
      { 'label':'Pennsylvania', 'value': 'PA'},
      { 'label':'Rhode Island', 'value': 'RI'},
      { 'label':'South Carolina', 'value': 'SC'},
      { 'label':'South Dakota', 'value': 'SD'},
      { 'label':'Tennessee', 'value': 'TN'},
      { 'label':'Texas', 'value': 'TX'},
      { 'label':'Utah', 'value': 'UT'},
      { 'label':'Vermont', 'value': 'VT'},
      { 'label':'Virgin Islands', 'value': 'VI'},
      { 'label':'Virginia', 'value': 'VA'},
      { 'label':'Washington', 'value': 'WA'},
      { 'label':'West Virginia', 'value': 'WV'},
      { 'label':'Wisconsin', 'value': 'WI'},
      { 'label':'Wyoming', 'value': 'WY'}
      ];
  }

}
