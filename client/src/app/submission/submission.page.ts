import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminFestivalService, Festival } from '../admin/services/admin-festival.service';
import { AdminFortService } from '../admin/services/admin-fort.service';
import { Submission } from '../admin/services/submission.service';
import { SubmissionService } from './submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {
  id: string;
  fort: 'Music' | 'Alefort' | 'Comedyfort' | 'Dragfort' | 'Foodfort' | 'Hackfort' | 'Kidfort' | 'Podfort' | 'Storyfort' | 'Yogafort';
  festival: Festival;
  festivalRequestComplete: boolean;
  submissionPending: boolean;
  submissionValue: Submission;

  constructor(
    private activatedRoute: ActivatedRoute,
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private router: Router,
    private submissionService: SubmissionService) {
    this.activatedRoute.queryParamMap.subscribe(async (map) => {
      this.festival = await this.festivalService.getActiveFestival();
      this.fort = map['params']['fort'];
      if (map['params']['id']) {
        const fortId = await this.getFortIdFromName(this.fort);
        this.submissionValue = await this.submissionService.getSubmission(this.festival.id, fortId.id, map['params']['id']);
      } else {
        this.submissionValue = null;
      }
    })
    
  }

  async ngOnInit() {
    this.festivalRequestComplete = true;
  }

  async submit(submission) {
    this.submissionPending = true;
    const fort = await this.getFortIdFromName(this.fort);
    await this.submissionService.createSubmission(submission, fort, this.festival);
    // TODO: observable to reload mySubmissions
    this.submissionPending = false;
    this.router.navigateByUrl('/submission-success');
  }

  async getFortIdFromName(name: string) {
    const forts = await this.fortService.getForts(this.festival.id);
    return forts.find(f => f.name === this.fort);
  }

}
