import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RestaurantTag {
  restaurantTagId: number;
  restaurantId: number;
  tagId: number;
  createdAt: string;
}

export interface Tag {
  tagID: number;
  name: string;
  restaurantTags: RestaurantTag[];
}

export interface TagCreateDto {
  name: string;
}

export interface TagUpdateDto {
  tagID: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:5137/api/tag';

  constructor(private http: HttpClient) {}

  // Get all tags
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/GetAll`);
  }

  // Get tag by id
  getTagById(tagId: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/GetById/${tagId}`);
  }

  // Create a new tag
  createTag(tagDto: TagCreateDto): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/Insert`, tagDto);
  }

  // Update an existing tag
  updateTag(tagDto: TagUpdateDto): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/Update`, tagDto);
  }

  deleteTag(tagId: number, forceDelete: boolean = false): Observable<any> {
    if (!tagId) {
      throw new Error('Tag ID is required');
    }

    const url = `${this.apiUrl}/Delete/${tagId}${
      forceDelete ? '?forceDelete=true' : ''
    }`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Delete tag error:', error);
        if (error.status === 404) {
          throw new Error('Tag not found.');
        } else if (error.status === 400) {
          throw new Error(error.error?.message || 'Tag is in use.');
        } else {
          throw new Error('Error deleting tag. Please try again.');
        }
      })
    );
  }

  checkTagUsage(tagID: number): Observable<number> {
    if (!tagID) {
      throw new Error('Tag ID is required');
    }
    return this.http.get<number>(`${this.apiUrl}/CheckTagUsage/${tagID}`).pipe(
      catchError((error) => {
        console.error('Check tag usage error:', error);
        if (error.status === 404) {
          throw new Error('Tag not found.');
        } else {
          throw new Error('Error checking tag usage. Please try again.');
        }
      })
    );
  }
}
