import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionEventService {
  private sessionResetSource = new Subject<number>();
  sessionReset$ = this.sessionResetSource.asObservable();

  triggerReset(topicId: number) {
    this.sessionResetSource.next(topicId);
  }
}