import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-my-votes',
  templateUrl: './my-votes.page.html',
  styleUrls: ['./my-votes.page.scss'],
})
export class MyVotesPage implements OnInit {
  submissions = [];
  constructor(private submissionService: SubmissionService) { }

  ngOnInit() {
    this.getSubmissions();
  }

  getSubmissions() {
    this.submissions = this.submissionService.getSubmissions();
  }

}
