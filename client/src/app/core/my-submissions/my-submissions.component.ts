import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Festival } from '../../admin/services/admin-festival.service';
import { AdminFortService, Fort } from '../../admin/services/admin-fort.service';
import { User } from '../../auth/user.service';
import { ActiveFestivalService } from '../../shared/active-festival.service';
import { SubmissionService } from '../../submission/submission.service';
import { MySubmissionService } from './my-submission.service';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss'],
})
export class MySubmissionsComponent implements OnInit {
  @Input() user: User;
  festival: Festival;
  forts: Fort[];
  submissions = [];
  mySubmissionsRequestComplete = false;
  fortsRequestComplete = false;

  constructor(
    private festivalService: ActiveFestivalService,
    private mySubmissionService: MySubmissionService,
    private submissionService: SubmissionService,
    private fortService: AdminFortService,
    private router: Router
    ) { }

  async ngOnInit() {
    if (this.user.authenticated) {
      this.festival = await this.getActiveFestival();
      await this.getForts(this.festival);
      this.getMySubmissions(this.user.claims.username, this.festival.id);
      
    }

    this.submissionService.getReloadMySubmissionsObservable().subscribe(result => {
      if (result.reload) {
        this.getMySubmissions(this.user.claims.username, this.festival.id);
      }
    })
  }

  getActiveFestival(): Promise<Festival> {
    return this.festivalService.getActiveFestival();
  }

  async getForts(festival) {
    this.forts = await this.fortService.getForts(festival.id);
    this.fortsRequestComplete = true;
  }

  async getMySubmissions(username: string, festivalId: string) {
    this.mySubmissionsRequestComplete = false;
    this.submissions = await this.mySubmissionService.getMySubmissions(username, festivalId);
    this.mySubmissionsRequestComplete = true;
  }

  editSubmission(submission) {
    const fort = this.forts.find(f => f.id === submission.fortId);
    this.router.navigate(['submission'], { queryParams: {'fort': fort.name, 'id': submission.id }})
  }

}
