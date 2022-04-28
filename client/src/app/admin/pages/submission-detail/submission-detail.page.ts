import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.page.html',
  styleUrls: ['./submission-detail.page.scss'],
})
export class SubmissionDetailPage implements OnInit {
  labels = ['bacon', 'pineapple']
  constructor() { }

  ngOnInit() {
  }

}
