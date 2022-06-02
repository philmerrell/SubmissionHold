import { Component, OnInit } from '@angular/core';
import { ActiveFestivalService } from '../../../shared/active-festival.service';
import { Festival } from '../../services/admin-festival.service';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.page.html',
  styleUrls: ['./submissions.page.scss'],
})
export class SubmissionsPage implements OnInit {
  festival: Festival;
  submissions = [];
  constructor(
    private activeFestivalService: ActiveFestivalService,
    private submissionService: SubmissionService) { }

  ngOnInit() {
    this.getSubmissions();
  }

  async getActiveFestival() {
    this.festival = await this.activeFestivalService.getActiveFestival();
  }

  getSubmissions() {
    this.submissions = this.submissionService.getSubmissions();
  }

}
