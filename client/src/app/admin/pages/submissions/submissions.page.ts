import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.page.html',
  styleUrls: ['./submissions.page.scss'],
})
export class SubmissionsPage implements OnInit {
  submissions = [];
  constructor(private submissionService: SubmissionService) { }

  ngOnInit() {
    this.getSubmissions();
  }

  getSubmissions() {
    this.submissions = this.submissionService.getSubmissions();
  }

}
