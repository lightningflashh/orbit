import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VocabularyLevel, VocabularyService } from '../vocabulary/vocabulary.service';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-create.html',
  styleUrls: ['./topic-create.css']
})
export class TopicCreateComponent {
  private vocabService = inject(VocabularyService);
  private router = inject(Router);

  topicTitle: string = '';
  description: string = '';
  level: VocabularyLevel = VocabularyLevel.BEGINNER;

  levels: VocabularyLevel[] = [
    VocabularyLevel.BEGINNER,
    VocabularyLevel.INTERMEDIATE,
    VocabularyLevel.ADVANCED
  ];

  createTopic() {
    if (!this.topicTitle) return;

    const newTopic = {
      name: this.topicTitle,
      description: this.description,
      level: this.level
    };

    this.vocabService.createTopic(newTopic).subscribe({
      next: res => {
        this.router.navigate(['/topics', res.id, 'add-vocab']);
      },
      error: err => console.error('Lỗi tạo Topic:', err)
    });
  }
}
