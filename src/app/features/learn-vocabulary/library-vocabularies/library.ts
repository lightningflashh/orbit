import { Component, OnInit, inject } from '@angular/core';
import { UserVocabularyService } from '../user-vocabulary.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.html'
})
export class LibraryComponent implements OnInit {
  private vocabService = inject(UserVocabularyService);
  private toast = inject(ToastService);

  allVocabs: any[] = [];
  filteredVocabs: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData(query: string = '') {
    this.vocabService.getAllVocabularies(query).subscribe(data => {
      this.allVocabs = data;
      this.filteredVocabs = data;
    });
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    // Bạn có thể gọi API search trực tiếp hoặc filter local
    this.filteredVocabs = this.allVocabs.filter(v =>
      v.word.toLowerCase().includes(query)
    );
  }

  addToMyMission(vocabId: number) {
    this.vocabService.addToLearning(vocabId).subscribe({
      next: () => {
        this.toast.show('Data Synced! Added to your learning mission.', 'success');
      },
      error: (err) => {
        if (err.status === 400) {
          this.toast.show('This word is already in your mission.', 'info');
        } else {
          this.toast.show('Failed to sync mission data.', 'error');
        }
      }
    });
  }
}