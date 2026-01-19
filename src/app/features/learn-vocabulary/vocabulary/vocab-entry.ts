import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VocabularyService } from './vocabulary.service';
import { UserVocabularyService } from '../user-vocabulary.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, forkJoin, finalize, Observable } from 'rxjs';
import { ToastService } from '../../../shared/toast/toast.service';
import { SessionEventService } from '../shared/session-event.service';

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
  private sessionEventService = inject(SessionEventService);

  topicId!: number;
  topic: any = null;
  cards: any[] = [];

  activeSuggestionIndex: number | null = null;
  suggestions: any[] = [];
  private searchSubject = new Subject<{ term: string, index: number }>();

  isSaving = false;

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
    return {
      word: '',
      meaning: '',
      phonetic: '',
      partOfSpeech: '',
      example: '',
      imageUrl: null,
      audioUrl: null,
      showExtra: false
    };
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
    // 1. Lọc danh sách các card hợp lệ (phải nhập word và meaning)
    const rawValidCards = this.cards.filter(card => card.word?.trim() && card.meaning?.trim());

    if (rawValidCards.length === 0) {
      this.toast.show('Không có nội dung hợp lệ để lưu.', 'info');
      return;
    }

    this.isSaving = true;

    // 2. Làm sạch dữ liệu trước khi gọi API Bulk
    // Mục tiêu: Xóa chuỗi base64 (imageUrl) để tránh lỗi Payload Too Large, 
    // nhưng vẫn giữ URL ảnh cũ (nếu có) từ server (bắt đầu bằng http).
    const cleanCardsForBulk = rawValidCards.map(card => ({
      ...card,
      imageUrl: (card.imageUrl && card.imageUrl.startsWith('http')) ? card.imageUrl : null
    }));

    // 3. GỌI BƯỚC 1: Lưu dữ liệu văn bản (Bulk)
    this.userVocabService.addBulkToLearning(this.topicId, cleanCardsForBulk).subscribe({
      next: (savedVocabs: any[]) => {

        // 4. GỌI BƯỚC 2: Xử lý upload ảnh (Media)
        // Tạo mảng chứa các Observable upload thực sự
        const uploadTasks: Observable<any>[] = [];

        console.log('Original Cards:', rawValidCards);

        rawValidCards.forEach((originalCard, index) => {
          // Kiểm tra xem card này có file ảnh mới được chọn không
          if (originalCard.imageFile) {
            // Lấy ID để upload: Ưu tiên ID từ server trả về (cho card mới) 
            // hoặc ID sẵn có trên card (cho card cũ chỉ thay đổi ảnh)
            const targetId = savedVocabs[index]?.data || originalCard.userVocabId;

            if (targetId) {
              const formData = new FormData();
              formData.append('image', originalCard.imageFile);

              // Đẩy task vào mảng
              uploadTasks.push(this.userVocabService.uploadMedia(targetId, formData));
            }
          }
        });

        // 5. THỰC THI UPLOAD SONG SONG
        if (uploadTasks.length > 0) {
          forkJoin(uploadTasks).subscribe({
            next: () => {
              this.toast.show('Đã cập nhật từ vựng và hình ảnh thành công!', 'success');
              this.finalizeSave();
            },
            error: (err) => {
              console.error('Media Upload Error:', err);
              this.toast.show('Lưu nội dung xong nhưng một số ảnh tải lên bị lỗi.', 'error');
              this.finalizeSave();
            }
          });
        } else {
          // Nếu không có ảnh nào cần tải lên
          this.toast.show('Lưu từ vựng thành công!', 'success');
          this.finalizeSave();
        }
      },
      error: (err) => {
        console.error('Bulk Save Error:', err);
        this.toast.show('Lỗi hệ thống khi lưu danh sách từ vựng.', 'error');
        this.isSaving = false;
      }
    });
  }

  private finalizeSave() {
    this.isSaving = false;
    this.cdr.detectChanges();
    this.sessionEventService.triggerReset(this.topicId);
    this.loadInitialData();
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // 1. Kiểm tra định dạng (Optional)
      if (!file.type.startsWith('image/')) {
        this.toast.show('Please select an image file.', 'error');
        return;
      }

      // 2. Tạo preview bằng FileReader
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Gán Base64 vào imageUrl để hiển thị lên giao diện ngay lập tức
        this.cards[index].imageUrl = e.target.result;
        this.cdr.detectChanges(); // Cập nhật giao diện
      };
      reader.readAsDataURL(file);

      // 3. (Lưu ý) Bạn có thể lưu file gốc này vào một property khác 
      // để gửi lên server qua FormData nếu API yêu cầu file thay vì base64
      this.cards[index].imageFile = file;
    }
  }

  removeImage(event: Event, index: number) {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    this.cards[index].imageUrl = null;
    this.cards[index].imageFile = null;
    this.cdr.detectChanges(); // Cập nhật giao diện
  }
}