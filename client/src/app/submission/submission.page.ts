import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminFestivalService, Festival } from '../admin/services/admin-festival.service';
import { AdminFortService } from '../admin/services/admin-fort.service';
import { SubmissionService } from './submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {
  fort: 'Music' | 'Comedy' | 'Alefort';
  festival: Festival;
  festivalRequestComplete: boolean;
  submissionPending: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private router: Router,
    private submissionService: SubmissionService) {
    this.fort = this.activatedRoute.snapshot.queryParamMap['params']['fort'];
    
  }

  async ngOnInit() {
    this.festival = await this.festivalService.getActiveFestival();
    this.festivalRequestComplete = true;
  }

  async submit(submission) {
    this.submissionPending = true;
    const fort = await this.getFortIdFromName();
    await this.submissionService.createSubmission(submission, fort, this.festival);
    this.submissionPending = false;
    this.router.navigateByUrl('/submission-success');
  }

  async getFortIdFromName() {
    const forts = await this.fortService.getForts(this.festival.id);
    return forts.find(f => f.name === this.fort);
  }

}
