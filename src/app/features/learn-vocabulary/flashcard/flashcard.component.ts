import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserVocabularyService, FlashcardCard } from '../user-vocabulary.service';

@Component({
  selector: 'app-orbit-session',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit {
  private flashcardService = inject(UserVocabularyService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  sessionId: string | null = null;
  currentCard: FlashcardCard | null = null;
  isFlipped = false;
  isFinished = false;
  isLoading = false;

  ngOnInit() {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    if (topicId) this.initializeSession(topicId);
  }

  private initializeSession(topicId: number) {
    const storageKey = `flashcard_session_topic_${topicId}`;
    const savedId = localStorage.getItem(storageKey);

    if (savedId) {
      this.sessionId = savedId;
      this.loadNextCard();
    } else {
      this.startNewSession(topicId, storageKey);
    }
  }

  startNewSession(topicId: number, storageKey: string) {
    this.isLoading = true;
    this.flashcardService.startSession(topicId).subscribe({
      next: (id) => {
        this.sessionId = id;
        localStorage.setItem(storageKey, id);
        this.loadNextCard();
      },
      error: () => this.isLoading = false
    });
  }

  loadNextCard() {
    if (!this.sessionId) return;
    this.isLoading = true;

    this.flashcardService.getCurrentCard(this.sessionId).subscribe({
      next: (card) => {
        this.currentCard = card;
        this.isFlipped = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.handleFinish()
    });
  }

  handleAnswer(quality: number) {
    if (!this.sessionId || this.isLoading) return;

    this.isLoading = true;
    this.flashcardService.submitAnswer(this.sessionId, quality).subscribe({
      next: () => {
        this.isFlipped = false;
        // Đợi thẻ lật về mặt trước xong (0.4s) rồi mới đổi chữ cho mượt
        setTimeout(() => this.loadNextCard(), 400);
      },
      error: () => this.isLoading = false
    });
  }

  handleFinish() {
    if (!this.sessionId) return;
    this.flashcardService.finishSession(this.sessionId).subscribe(() => {
      const topicId = this.route.snapshot.paramMap.get('topicId');
      localStorage.removeItem(`flashcard_session_topic_${topicId}`);
      this.isFinished = true;
      this.currentCard = null;
      this.cdr.detectChanges();
    });
  }

  toggleFlip() {
    if (this.currentCard && !this.isLoading) {
      this.isFlipped = !this.isFlipped;
    }
  }
}