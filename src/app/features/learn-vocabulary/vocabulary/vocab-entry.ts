import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VocabularyService } from './vocabulary.service';
import { UserVocabularyService } from '../user-vocabulary.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-vocab-entry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vocab-entry.html',
  styleUrls: ['./vocab-entry.css']
})
export class VocabEntryComponent implements OnInit {
  private vocabService = inject(VocabularyService);
  private userVocabService = inject(UserVocabularyService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  topicId!: number;
  topic: any = null;
  cards: any[] = [];

  activeSuggestionIndex: number | null = null;
  suggestions: any[] = [];
  private searchSubject = new Subject<{ term: string, index: number }>();

  ngOnInit() {
    this.topicId = Number(this.route.snapshot.paramMap.get('id'));
    this.vocabService.getTopicById(this.topicId).subscribe(res => this.topic = res);
    this.loadInitialData();
    this.setupSearch();
  }

  loadInitialData() {
    this.userVocabService.getVocabsByTopic(this.topicId).subscribe((res: any) => {
      const data = res || [];
      this.cards = data.length > 0 ? data.map((v: any) => ({
        ...v,
        showExtra: !!(v.phonetic || v.partOfSpeech || v.example) // Hiện ô phụ nếu có data
      })) : [this.emptyCard(), this.emptyCard()];
      this.cdr.detectChanges();
    });
  }

  emptyCard() {
    return { word: '', meaning: '', phonetic: '', partOfSpeech: '', example: '', showExtra: false };
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged((p, c) => p.term === c.term),
      switchMap(({ term }) => {
        if (!term.trim()) return of({ content: [] });
        return this.vocabService.searchVocab(term);
      })
    ).subscribe((res: any) => {
      this.suggestions = res.content || [];
      this.cdr.detectChanges();
    });
  }

  onWordInput(val: string, index: number) {
    this.activeSuggestionIndex = index;
    this.cards[index].word = val;
    this.searchSubject.next({ term: val, index });
  }

  selectSuggestion(item: any, index: number) {
    this.cards[index] = { ...item, showExtra: true };
    this.closeSuggestions();
  }

  toggleExtra(index: number) {
    this.cards[index].showExtra = !this.cards[index].showExtra;
    this.cdr.detectChanges();
  }

  closeSuggestions() {
    this.activeSuggestionIndex = null;
    this.suggestions = [];
    this.cdr.detectChanges();
  }

  addCard() {
    this.cards.push(this.emptyCard());
    this.cdr.detectChanges();
  }

  isModalOpen = false;
  cardToDeleteIndex: number | null = null;
  cardToDeleteId: any = null;

  openDeleteModal(index: number, card: any) {
    if (card.id) {
      this.isModalOpen = true;
      this.cardToDeleteIndex = index;
      this.cardToDeleteId = card.id;
    } else {
      // Nếu card trống chưa có ID thì xóa luôn không cần hỏi
      this.cards.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  confirmDelete() {
    if (this.cardToDeleteIndex !== null && this.cardToDeleteId) {
      this.userVocabService.removeFromLearning(this.cardToDeleteId).subscribe(() => {
        this.cards.splice(this.cardToDeleteIndex!, 1);
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.cardToDeleteIndex = null;
    this.cardToDeleteId = null;
    this.cdr.detectChanges();
  }

  saveAllCards() {
    const validCards = this.cards.filter(card => card.word && card.meaning);

    if (validCards.length === 0) {
      this.toast.show('Không có thẻ hợp lệ để lưu.', 'info');
      return;
    }

    this.userVocabService.addBulkToLearning(this.topicId, validCards).subscribe({
      next: (response) => {
        this.toast.show('Lưu thành công!', 'success');
      },
      error: (err) => {
        this.toast.show('Lưu thất bại. Vui lòng thử lại.', 'error');
      }
    });
  }
}