import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

export interface UserVocabulary {
  id: number;
  word: string;
  definition: string;
  example?: string;
  nextReviewDate: string;
}

export interface FlashcardCard {
  userVocabId: number;

  word: string;

  partOfSpeech?: string;

  meaning: string;

  phonetic?: string;

  example?: string;

  audioUrl?: string;

  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserVocabularyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/learn-vocab`;

  startSession(topicId: number, limit: number = 10): Observable<string> {
    return this.http.post<any>(`${this.apiUrl}/session/start`, null, {
      params: { topicId, limit }
    }).pipe(map(res => res.data.sessionId));
  }

  getCurrentCard(sessionId: string): Observable<FlashcardCard> {
    return this.http.get<any>(`${this.apiUrl}/session/${sessionId}`).pipe(map(res => res.data));
  }

  submitAnswer(sessionId: string, quality: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/session/${sessionId}/answer`, null, {
      params: { quality }
    });
  }

  finishSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/session/${sessionId}`);
  }

  getVocabsByTopic(topicId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/topics/${topicId}`);
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