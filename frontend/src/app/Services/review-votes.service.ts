import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewVotes {
  reviewVotesID: number;
  userID: number;
  user: any;
  reviewID: number;
  review: any;
  rating: number;
  isLike: boolean;
}

export interface ReviewVotesCreateDto {
  userID: number;
  reviewID: number;
  isLike: boolean;
}

export interface ReviewVotesUpdateDto {
  userID?: number;
  reviewID?: number;
  isLike?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewVotesService {
  private apiUrl = 'http://localhost:5137/api/ReviewVotes';

  constructor(private http: HttpClient) {}

  getReviewVotesByReview(reviewID: number): Observable<ReviewVotes[]> {
    return this.http.get<ReviewVotes[]>(
      `${this.apiUrl}/reviewId?reviewId=${reviewID}`
    );
  }

  postReviewVote(reviewVoteDto: ReviewVotesCreateDto) {
    return this.http.post<ReviewVotes>(`${this.apiUrl}`, reviewVoteDto);
  }

  updateReviewVote(reviewVoteId: number, reviewVoteDto: ReviewVotesUpdateDto) {
    const apiUrl = `http://localhost:5137/api/ReviewVotes/${reviewVoteId}`;
    return this.http.put<ReviewVotes>(apiUrl, reviewVoteDto);
  }
}
