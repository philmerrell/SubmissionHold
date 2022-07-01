import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { AdminFortService } from '../../services/admin-fort.service';
import { Submission, SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.page.html',
  styleUrls: ['./submission-detail.page.scss'],
})
export class SubmissionDetailPage implements OnInit {
  festival: Festival;
  forts = [];
  id: string;
  labels = ['bacon', 'pineapple'];
  submission;
  submissionRequestComplete: boolean;

  constructor(
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private submissionService: SubmissionService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    await this.getActiveFestival();
    await this.getSubmission();
  }

  async getActiveFestival() {
    this.festival = await this.festivalService.getActiveFestival();
    this.forts = await this.fortService.getForts(this.festival.id);
  }

  async getSubmission() {
    this.submission = await this.submissionService.getSubmission(this.festival, this.forts[0], this.id);
    console.log(this.submission);
    this.submissionRequestComplete = true;
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getSpotifyArtistId(url: string) {
    const split = url.split('/');
    const id = split[split.length - 1];
    return id;
  }

  getYoutubeVideoId(url: string) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

}
