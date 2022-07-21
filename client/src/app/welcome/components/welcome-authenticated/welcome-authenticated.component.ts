import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/admin-festival.service';
import { AdminFortService, Fort } from '../../../admin/services/admin-fort.service';
import { ActiveFestivalService } from '../../../shared/active-festival.service';

interface FortLink {
  id: string;
  external: boolean;
  name: string;
  description: string;
  url?: string;
};

@Component({
  selector: 'app-welcome-authenticated',
  templateUrl: './welcome-authenticated.component.html',
  styleUrls: ['./welcome-authenticated.component.scss'],
})
export class WelcomeAuthenticatedComponent implements OnInit {
  festivalRequestComplete: boolean;
  festival: Festival;
  fortLinks: FortLink[];
  forts: Fort[];
  fortsRequestComplete: boolean;

  constructor(private activeFestivalService: ActiveFestivalService, private fortService: AdminFortService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    await this.getForts();
    this.createFortLinks(this.forts);
  }

  async getActiveFestival() {
    this.festival = await this.activeFestivalService.getActiveFestival();
    this.festivalRequestComplete = true;
  }
  
  async getForts() {
    this.forts = await this.fortService.getForts(this.festival.id);
    this.fortsRequestComplete = true;
  }

  // Need to accommodate filmfort, which doesn't come from the DB.
  // Also need to accommodate the wish for forts to be sorted alpha
  // Should be Alpha except for music should be first 
  createFortLinks(forts: Fort[]) {
    const fortLinks = [];
    for (let fort of forts) {
      const link = {
        name: fort.name,
        id: fort.id,
        external: false,
        description: fort.description
      };
      fortLinks.push(link);
    }

    // manually add filmfort
    fortLinks.push({
      name: 'Filmfort',
      id: '',
      external: true,
      description: 'Got a short? A feature? Submit your film via Film Freeway, click here!',
      url: 'https://filmfreeway.com/filmfortfest'
    });

    // Sort forts alpha
    this.fortLinks = fortLinks.sort((a, b) => a.name > b.name ? 1 : -1);

    // Pull music out and put at beginning of array.
    const musicIndex = this.fortLinks.findIndex(f => f.name === 'Music');
    const musicLink = this.fortLinks.splice(musicIndex, 1);
    this.fortLinks.unshift(musicLink[0]);
  }

}
