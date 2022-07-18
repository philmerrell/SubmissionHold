import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../admin/services/admin-festival.service';
import { AdminFortService, Fort } from '../../admin/services/admin-fort.service';
import { User, UserService } from '../../auth/user.service';
import { ActiveFestivalService } from '../../shared/active-festival.service';
import { MySubmissionService } from './my-submission.service';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.scss'],
})
export class MySubmissionsComponent implements OnInit {
  @Input() user: User;
  festival: Festival;
  submissions = [];

  constructor(
    private festivalService: ActiveFestivalService,
    private fortService: AdminFortService,
    private mySubmissionService: MySubmissionService
    ) { }

  async ngOnInit() {
    if (this.user.authenticated) {
      const festival = await this.getActiveFestival();
      const forts = await this.getForts(festival);
      this.getAllSubmissions(festival, forts);
      // get all submissions for all forts
      // getUsersSubmitted 
    }
  }

  getActiveFestival(): Promise<Festival> {
    return this.festivalService.getActiveFestival();
  }

  getForts(festival: Festival) {
    return this.fortService.getForts(festival.id);
  }

  getMySubmissions(festivalId: string, fortId: string) {
    return this.mySubmissionService.getMySubmissions(this.user.claims.username, festivalId, fortId);
  }

  private async getAllSubmissions(festival: Festival, forts: Fort[]) {
    
    for (let fort of forts) {
      // const submissions = await this.getMySubmissions(festival.id, fort.id);
      // console.log(submissions);
    }
  }




}
