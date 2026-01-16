import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export enum VocabularyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface TopicDTO {
  id?: number;
  name: string;
  description?: string;
  level: VocabularyLevel
}

export interface VocabularyDTO {
  id?: number;
  word: string;
  meaning: string;
  example?: string;
  topicId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private http = inject(HttpClient);
  private readonly topicUrl = `${environment.apiUrl}/topics`;
  private readonly vocabUrl = `${environment.apiUrl}/vocabs`;

  createTopic(topic: TopicDTO): Observable<TopicDTO> {
    return this.http.post<TopicDTO>(this.topicUrl, topic);
  }

  getTopicById(id: number): Observable<TopicDTO> {
    return this.http.get<TopicDTO>(`${this.topicUrl}/${id}`);
  }

  getAllTopics(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.topicUrl, { params });
  }

  createVocab(vocab: VocabularyDTO): Observable<VocabularyDTO> {
    return this.http.post<VocabularyDTO>(this.vocabUrl, vocab);
  }

  getVocabsByTopic(topicId: number, page: number = 0, size: number = 100): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.vocabUrl}/by-topic/${topicId}`, { params });
  }

  searchVocab(term: string): Observable<VocabularyDTO[]> {
    const params = new HttpParams().set('query', term);
    return this.http.get<VocabularyDTO[]>(`${this.vocabUrl}/search`, { params });
  }

  updateVocab(id: number, vocab: VocabularyDTO): Observable<VocabularyDTO> {
    return this.http.put<VocabularyDTO>(`${this.vocabUrl}/${id}`, vocab);
  }

  deleteVocab(id: number): Observable<void> {
    return this.http.delete<void>(`${this.vocabUrl}/${id}`);
  }
}