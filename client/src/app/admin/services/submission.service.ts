import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Festival } from './admin-festival.service';
import { Fort } from './admin-fort.service';
import { VoteService } from './vote.service';

export interface SubmissionsApiResponse {
  pageSize: string;
  paginationKey: string;
  submissions: Submission[]
}

export interface Submission {
  city: string;
  contactInfo: {
    agentContact: string;
    email: string;
    labelContact: string;
    managementContact: string;
    name: string;
    phoneNumber: string;
    publicityContact: string;
    relationship: string;
  };
  country: string;
  description: string;
  festivalId: string;
  fortId: string;
  genres: string[];
  id: string;
  image: string;
  labels: any[];
  links: {
    appleMusic: string;
    bandcamp: string;
    facebook: string;
    instagram: string;
    soundcloud: string;
    spotify: string;
    tikTok: string;
    twitter: string;
    videos: any[]
  };
  name: string;
  state: string;
  statement: string;
  submissionDate: string;
  website: string;
  voted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  submissionsPaginationKey: string;
  constructor(private http: HttpClient, private voteService: VoteService) { }

  async getSubmissions(festival: Festival, fort: Fort, paginationKey?: string): Promise<SubmissionsApiResponse>{
    const url = paginationKey ? `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions?pageSize=100&paginationKey=${paginationKey}` : `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions?pageSize=100`;
    return this.http.get<SubmissionsApiResponse>(url)
      .pipe(
        tap(async (response) => {
          const votes = await this.getVotes();
          for (let submission of response.submissions) {
            submission.voted = votes.includes(submission.id);
          }
          return response;
        })
      )
      .toPromise();
  }

  getSubmission(festival: Festival, fort: Fort, id: string): Promise<Submission> {
    return this.http.get<Submission>(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions/${id}`).toPromise();
  }

  getVotes = async () => {
    const votes = await this.voteService.getVotes();
    return votes.map(v => v.submissionId);
  }
  
}
