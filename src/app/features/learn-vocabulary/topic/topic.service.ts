import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../types/ApiResponse";
import { Topic } from "../../../types/Topic";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TopicService {
  private http = inject(HttpClient);
  private readonly topicUrl = `${environment.apiUrl}/topics`;

  getUserTopics(page: number, size: number, name: string, level: string): Observable<ApiResponse<Topic>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    if (name && name.trim() !== '') {
      params = params.set('name', name);
      return this.http.get<ApiResponse<Topic>>(`${this.topicUrl}/search`, { params });
    }
    if (level && level.trim() !== '') {
      params = params.set('level', level);
      return this.http.get<ApiResponse<Topic>>(`${this.topicUrl}/search`, { params });
    }

    return this.http.get<ApiResponse<Topic>>(`${this.topicUrl}/my`, { params });
  }
}