import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { Label, LabeledSubmissionsResponse, LabelService, LabelsResponse } from '../../services/label.service';
import { Submission } from '../../services/submission.service';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-labeled-submissions',
  templateUrl: './labeled-submissions.page.html',
  styleUrls: ['./labeled-submissions.page.scss'],
})
export class LabeledSubmissionsPage implements OnInit {
  festival: Festival;
  labelsResponse: LabelsResponse;
  selectedLabel: Label;
  paginationKey: string;
  submissionsResponse: LabeledSubmissionsResponse;
  submissionsResponseComplete: boolean;
  submissions: Submission[] = [];
  labelsRequestComplete: boolean;

  constructor(
    private route: ActivatedRoute,
    private festivalService: AdminFestivalService,
    private labelService: LabelService,
    private voteService: VoteService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    this.route.queryParamMap.subscribe(async (query: any) => {
      const labelId = query.params['label'];
      await this.getVotes();
      this.setSelectedLabel(labelId);
      this.getSubmissions(labelId);
    });
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
  }

  async getLabels() {
    this.labelsResponse = await this.labelService.getLabels(this.festival.id);
    this.labelsRequestComplete = true;
  }

  async getSubmissions(labelId: string) {
    this.submissionsResponseComplete = false;
    this.submissionsResponse = await this.labelService.getSubmissionsWithLabel(this.festival.id, labelId);
    this.submissions = this.submissionsResponse.submissions;
    this.paginationKey = this.submissionsResponse.paginationKey;
    this.submissionsResponseComplete = true;
    this.markVoted();
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
      this.submissionsResponse = await this.labelService.getSubmissionsWithLabel(this.festival.id, this.selectedLabel.id, this.paginationKey);
      this.paginationKey = this.submissionsResponse.paginationKey;
      this.submissions = this.submissions.concat(this.submissionsResponse.submissions);
      this.markVoted();
      event.target.complete();
    }

  }

  async setSelectedLabel(labelId: string) {
    this.labelsResponse = await this.labelService.getLabels(this.festival.id);
    this.selectedLabel = this.labelsResponse.labels.find(l => l.id === labelId);
  }

  async handleLabelChange(event) {
    const label = event.detail.value;
    if (label) {
      this.selectedLabel = label;
      this.getSubmissions(label);
    }
  }

}
