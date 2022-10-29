import { Component, OnInit } from '@angular/core';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { AdminFortService, Fort } from '../../services/admin-fort.service';
import { SubmissionService } from '../../services/submission.service';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-vote-tally',
  templateUrl: './vote-tally.page.html',
  styleUrls: ['./vote-tally.page.scss'],
})
export class VoteTallyPage implements OnInit {
  festival: Festival;
  forts = [];
  selectedFort: Fort;
  paginationKey: string;
  voteTallyResponse: any;
  voteTallyResponseComplete: boolean;
  tally: any[] = [];
  sort: 'HighToLow' | 'LowToHigh' = 'HighToLow';
  
  constructor(
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private voteService: VoteService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    this.getVoteTally(this.forts[0]);
  }

  async getActiveFestival() {
    this.festival = await this.festivalService.getActiveFestival();
    this.forts = await this.fortService.getForts(this.festival.id);
    this.selectedFort = this.forts[0];
  }

  async getVoteTally(fort: Fort) {
    this.voteTallyResponseComplete = false;
    this.voteTallyResponse = await this.voteService.getVoteTally(this.festival, fort, this.sort);
    this.tally = this.voteTallyResponse.results;
    this.paginationKey = this.voteTallyResponse.paginationKey;
    this.voteTallyResponseComplete = true;
    console.log(this.tally);
  }

  async getMoreVoteTally(event) {
    if (!this.paginationKey) {
      event.target.disabled = true;
    }

    if (this.paginationKey) {
      this.voteTallyResponse = await this.voteService.getVoteTally(this.festival, this.forts[0], this.sort, this.paginationKey);
      this.paginationKey = this.voteTallyResponse.paginationKey;
      this.tally = this.tally.concat(this.voteTallyResponse.results);
      event.target.complete();
    }

  }

  handleChangeSort() {
    this.voteTallyResponseComplete = false;
    this.sort = this.sort === 'HighToLow' ? 'LowToHigh' : 'HighToLow';
    this.tally = [];
    this.getVoteTally(this.selectedFort);
  }

  async handleFortChange(event) {
    const fort = event.detail.value;
    if (fort) {
      this.selectedFort = fort;
      this.getVoteTally(fort);
    }
  }

}
