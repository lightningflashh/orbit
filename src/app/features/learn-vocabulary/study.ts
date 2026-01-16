import { Component, OnInit, inject } from '@angular/core';
import { UserVocabularyService, UserVocabulary } from './user-vocabulary.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.html',
  styleUrls: ['./study.css']
})
export class StudyComponent implements OnInit {
  private vocabService = inject(UserVocabularyService);

  dueCards: UserVocabulary[] = [];
  currentIndex = 0;
  isFlipped = false;

  get currentCard() {
    return this.dueCards[this.currentIndex];
  }

  ngOnInit() {
    this.vocabService.getDueVocabularies().subscribe(data => {
      this.dueCards = data;
    });
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  submitScore(quality: number) {
    const vocabId = this.currentCard.id;

    this.vocabService.submitReview(vocabId, quality).subscribe(() => {
      this.isFlipped = false;

      // Đợi hiệu ứng lật thẻ về mặt trước rồi mới chuyển câu tiếp theo
      setTimeout(() => {
        this.currentIndex++;
      }, 300);
    });
  }
}