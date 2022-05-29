import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from './submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {
  fort: 'music' | 'comedy';

  constructor(private activatedRoute: ActivatedRoute, private submissionService: SubmissionService) {
    this.fort = this.activatedRoute.snapshot.queryParamMap['params']['fort'];
  }

  ngOnInit(): void {
    
  }

  async submit(submission) {
    console.log(submission);
    // await this.submissionService.createSubmission(submission);

  }

}
