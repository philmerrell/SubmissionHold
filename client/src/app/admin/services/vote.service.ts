import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Festival } from './admin-festival.service';
import { Fort } from './admin-fort.service';

interface Vote {
  submissionId: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  votes: Vote[];

  constructor(private http: HttpClient) { }

  submitVote(submissionId: string, value: number) {
    try {
      this.http.post(`${environment.apiUrl}/votes`, { submissionId, value }).toPromise();
      this.votes.push({ submissionId, value });
    } catch (error) {
      alert('Uh oh. Voting failed');
    } 
  }

  getVotes(): Promise<Vote[]> {
    if (!this.votes) {
      const votes = this.http.get<Vote[]>(`${environment.apiUrl}/votes`).pipe(
        tap(response => this.votes = response)
      ).toPromise();
      return votes;
    } else {
      return Promise.resolve(this.votes);
    }
  }

  async findVote(submissionId: string) {
    const votes = await this.getVotes();
    return votes.find(v => v.submissionId === submissionId);
  }

  getVoteTally(festival: Festival, fort: Fort, sort: 'HighToLow' | 'LowToHigh', paginationKey?: string, ) {
    const url = paginationKey ? `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/vote-tally?pageSize=100&paginationKey=${paginationKey}&sort=${sort}` : `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/vote-tally?pageSize=100&sort=${sort}`;
    return this.http.get<any>(url).toPromise();
  }

}
