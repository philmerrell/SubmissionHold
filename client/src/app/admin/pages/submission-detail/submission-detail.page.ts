import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminFestivalService, Festival } from '../../services/admin-festival.service';
import { AdminFortService } from '../../services/admin-fort.service';
import { Label, LabelService, LabelsResponse } from '../../services/label.service';
import { Submission, SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.page.html',
  styleUrls: ['./submission-detail.page.scss'],
})
export class SubmissionDetailPage implements OnInit, OnDestroy {
  festival: Festival;
  forts = [];
  id: string;
  labelResponse: LabelsResponse;
  labels: Label[];
  labelsRequestComplete: boolean;
  labelSubscription: Subscription;
  submission: Submission;
  submissionRequestComplete: boolean;

  constructor(
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private labelService: LabelService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private submissionService: SubmissionService) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.subscribeToLabelReload();
    await this.getActiveFestival();
    await this.getSubmission();
    this.getLabels();
  }

  ngOnDestroy(): void {
    if(this.labelSubscription) {
      this.labelSubscription.unsubscribe();
    }
  }

  async getActiveFestival() {
    this.festival = await this.festivalService.getActiveFestival();
    this.forts = await this.fortService.getForts(this.festival.id);
  }

  async getSubmission() {
    this.submission = await this.submissionService.getSubmission(this.festival, this.forts[0], this.id);
    console.log(this.submission);
    this.labels = this.submission.labels;
    this.submissionRequestComplete = true;
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async getLabels() {
    this.labelResponse = await this.labelService.getLabels(this.festival.id);
    this.labelsRequestComplete = true;
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

  getVimeoVideoId(url: string) {
    // Look for a string with 'vimeo', then whatever, then a
    // forward slash and a group of digits.
    var match = /vimeo.*\/(\d+)/i.exec( url );

    // If the match isn't null (i.e. it matched)
    if ( match ) {
      // The grouped/matched digits from the regex
      return match[1];
    }
  }

  handleLabelChange(event) {
    const labels = event.detail.value;
    for(let label of labels) {
      this.labelService.createLabel(this.festival.id, {
        name: label.name,
        submissionIds: [this.submission.id]
      })
    }
  }

  videoLinkType(url: string) {
    if (url) {
      if (url.indexOf('youtube.com') !== -1 || url.indexOf('youtu.be') !== -1) {
        return 'youtube';
      }
      if (url.indexOf('vimeo.com') !== -1) {
        return 'vimeo'
      }
    }
  }

  subscribeToLabelReload() {
    this.labelSubscription = this.labelService.getReloadLabelsObservable()
      .subscribe((response: { reload: boolean }) => {
        if (response.reload) {
          this.getLabels();
        }
      })
  }

  compareLabelWith(o1, o2) {
    if(!o1 || !o2) {
      return o1 === o2;
    }

    if(Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

}
