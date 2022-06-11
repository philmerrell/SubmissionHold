import { Component, OnInit } from '@angular/core';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { AdminFortService } from '../../services/admin-fort.service';
import { SubmissionsApiResponse, SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.page.html',
  styleUrls: ['./submissions.page.scss'],
})
export class SubmissionsPage implements OnInit {
  festival: Festival;
  forts = [];
  paginationKey: string;
  submissionsResponse: SubmissionsApiResponse;
  submissions: any[] = [];
  constructor(
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private submissionService: SubmissionService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    this.getSubmissions();
  }

  async getActiveFestival() {
    this.festival = await this.festivalService.getActiveFestival();
    this.forts = await this.fortService.getForts(this.festival.id);
  }

  async getSubmissions() {
    this.submissionsResponse = await this.submissionService.getSubmissions(this.festival, this.forts[0]);
    this.submissions = this.submissionsResponse.submissions;
    this.paginationKey = this.submissionsResponse.paginationKey;
  }

  async getMoreSubmissions(event) {
    this.submissionsResponse = await this.submissionService.getSubmissions(this.festival, this.forts[0], this.paginationKey);
    this.paginationKey = this.submissionsResponse.paginationKey;
    this.submissions = this.submissions.concat(this.submissionsResponse.submissions);
    event.target.complete();

    if (!this.paginationKey) {
      event.target.disabled = true;
    }
  }

}
