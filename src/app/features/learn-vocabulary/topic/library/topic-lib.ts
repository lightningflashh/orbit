import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../topic.service'; // Đảm bảo đúng đường dẫn
import { Topic } from '../../../../types/Topic'; // Đảm bảo đúng đường dẫn
import { PaginationMeta } from '../../../../types/ApiResponse'; // Đảm bảo đúng đường dẫn
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'; // Import cho debounce search

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-lib.html',
  styleUrls: ['./topic-lib.css']
})
export class LibraryComponent implements OnInit {
  private topicService = inject(TopicService);
  private cdr = inject(ChangeDetectorRef);
  public router = inject(Router);

  topics: Topic[] = [];
  meta?: PaginationMeta;
  isLoading = true;

  searchTerm: string = '';
  selectedLevel: string = ''; // Thêm biến cho level đang chọn
  levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']; // Danh sách các level

  currentPage: number = 0;
  private searchSubject = new Subject<string>(); // Subject cho debounce search

  ngOnInit() {
    this.fetchData();

    // Cấu hình debounce: Chờ 500ms sau khi người dùng ngừng gõ mới trigger search
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 0; // Reset về trang 0 khi search mới
      this.fetchData();
    });
  }

  // Hàm chính để tải dữ liệu các học phần
  fetchData() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Kích hoạt Change Detection để hiển thị trạng thái loading

    this.topicService.getUserTopics(
      this.currentPage,
      12, // pageSize
      this.searchTerm,
      this.selectedLevel // Truyền thêm selectedLevel
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.topics = res.data.result || []; // Đảm bảo luôn là mảng
          this.meta = res.data.meta;
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Ép vẽ lại UI sau khi nhận data
      },
      error: (err) => {
        console.error('Lỗi khi tải học phần:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Xử lý sự kiện khi người dùng gõ vào ô tìm kiếm (dùng cho debounce)
  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  // Hàm khi người dùng click vào nút lọc theo level
  filterByLevel(level: string) {
    // Nếu click vào level đang chọn, thì bỏ chọn (reset về '')
    this.selectedLevel = this.selectedLevel === level ? '' : level;
    this.currentPage = 0; // Reset về trang 0 khi lọc
    this.fetchData();
  }

  // Chuyển hướng đến trang tạo học phần mới
  goToCreate() {
    this.router.navigate(['/topics/create']);
  }

  viewTopic(topicId: number | undefined) {
    if (topicId) {
      this.router.navigate(['/topics', topicId]);
    }
  }

  goToEdit(topicId: number | undefined) {
    if (topicId) {
      this.router.navigate(['/topics', topicId, 'add-vocab']);
    }
  }

  // Hàm cho nút phân trang "trước"
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchData();
    }
  }

  // Hàm cho nút phân trang "sau"
  nextPage() {
    if (this.meta && this.currentPage < this.meta.pages - 1) {
      this.currentPage++;
      this.fetchData();
    }
  }
}