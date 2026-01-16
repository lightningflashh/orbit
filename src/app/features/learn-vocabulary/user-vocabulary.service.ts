import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UserVocabulary {
  id: number;
  word: string;
  definition: string;
  example?: string;
  nextReviewDate: string;
}

@Injectable({ providedIn: 'root' })
export class UserVocabularyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/learn-vocab`;

  getVocabsByTopic(topicId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/topics/${topicId}`);
  }

  /**
   * Lấy danh sách từ vựng đến hạn ôn tập
   */
  getDueVocabularies(): Observable<UserVocabulary[]> {
    return this.http.get<UserVocabulary[]>(`${this.apiUrl}/due`);
  }

  /**
   * Gửi kết quả đánh giá SM-2 (1-5)
   */
  submitReview(vocabId: number, quality: number): Observable<UserVocabulary> {
    return this.http.post<UserVocabulary>(`${this.apiUrl}/${vocabId}/review`, { quality });
  }

  /**
   * Thêm một từ vựng vào danh sách học tập cá nhân
   */
  addToLearning(vocabId: number): Observable<UserVocabulary> {
    return this.http.post<UserVocabulary>(`${this.apiUrl}/${vocabId}`, {});
  }

  addBulkToLearning(topicId: number, cards: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bulk/topics/${topicId}`, cards);
  }

  /**
   * Lấy toàn bộ từ vựng đang học (có tìm kiếm)
   */
  getAllVocabularies(search: string = ''): Observable<any[]> {
    const params = new HttpParams().set('query', search);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  /**
   * Xóa từ vựng khỏi danh sách học tập (SM-2)
   */
  removeFromLearning(vocabId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vocabId}`);
  }
}