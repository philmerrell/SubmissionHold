import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '../../../form-utils';
import { SubmissionService } from '../../submission.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../../environments/environment';
import { Festival } from '../../../admin/services/admin-festival.service';


@Component({
  selector: 'app-music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss'],
})
export class MusicFormComponent implements OnInit {
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
    this.states = this.getStates();
    this.genres = this.getGenres();
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
      genres: [[]],
      links: this.createLinksFormGroup(),
      statement: ['', Validators.required],
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

  private removeEmptyVideoLinks(submission: any) {
    submission.links.videos = submission.links.videos.filter(v => v !== '');
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

  getGenres() {
    return [
      'Acoustic',
      'Alternative',
      'Ambient',
      'Americana',
      'Bluegrass',
      'Blues',
      'Classical',
      'Country',
      'Dance',
      'DJ',
      'Doom',
      'Dream Pop',
      'Electronic',
      'Experimental',
      'Folk',
      'Funk',
      'Garage',
      'Goth',
      'Hardcore',
      'Heavy',
      'Hip-hop',
      'Indie',
      'Industrial',
      'Jazz',
      'Latin',
      'Lo-fi',
      'Metal',
      'New Wave',
      'Pop',
      'Post-Rock',
      'Psychedelic',
      'Punk',
      'R&B',
      'Rap',
      'Reggae / Ska',
      'Rock',
      'Shoegaze',
      'Singer-Songwriter',
      'Soul',
      'Surf',
      'World',
      'Canada'
    ]
  }

}
