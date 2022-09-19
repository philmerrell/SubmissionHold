import { Component, OnInit } from '@angular/core';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { AdminFortService, Fort } from '../../services/admin-fort.service';
import { SubmissionsApiResponse, SubmissionService } from '../../services/submission.service';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.page.html',
  styleUrls: ['./submissions.page.scss'],
})
export class SubmissionsPage implements OnInit {
  festival: Festival;
  forts = [];
  selectedFort: Fort;
  paginationKey: string;
  submissionsResponse: SubmissionsApiResponse;
  submissionsResponseComplete: boolean;
  submissions: any[] = [];

  constructor(
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private submissionService: SubmissionService,
    private voteService: VoteService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    await this.getVotes();
    this.getSubmissions(this.forts[0]);
  }

  async ionViewDidEnter() {
    this.markVoted();
  }

  async markVoted() {
    const votes = await this.getVotes();
    for (let submission of this.submissions) {
      submission.voted = votes.includes(submission.id);
    }
  }

  async getActiveFestival() {
    this.festival = await this.festivalService.getActiveFestival();
    this.forts = await this.fortService.getForts(this.festival.id);
    this.selectedFort = this.forts[0];
  }

  async getSubmissions(fort: Fort) {
    this.submissionsResponseComplete = false;
    this.submissionsResponse = await this.submissionService.getSubmissions(this.festival, fort);
    this.submissions = this.submissionsResponse.submissions;
    this.paginationKey = this.submissionsResponse.paginationKey;
    this.markVoted();
    this.submissionsResponseComplete = true;
  }

  async getVotes() {
    const votes = await this.voteService.getVotes();
    return votes.map(v => v.submissionId);
  }

  async getMoreSubmissions(event) {
    if (!this.paginationKey) {
      event.target.disabled = true;
    }

    if (this.paginationKey) {
      this.submissionsResponse = await this.submissionService.getSubmissions(this.festival, this.forts[0], this.paginationKey);
      this.paginationKey = this.submissionsResponse.paginationKey;
      this.submissions = this.submissions.concat(this.submissionsResponse.submissions);
      this.markVoted();
      event.target.complete();
    }

  }

  async handleFortChange(event) {
    const fort = event.detail.value;
    if (fort) {
      this.selectedFort = fort;
      this.getSubmissions(fort);

    }
  }

}
