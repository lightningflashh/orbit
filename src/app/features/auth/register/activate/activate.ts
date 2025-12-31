import { Component, OnInit, inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-activate',
  templateUrl: './activate.html',
  styleUrls: ['./activate.css']
})
export class ActivateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  // Lấy danh sách các ô input từ giao diện
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  keyArray: string[] = new Array(20).fill('');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const key = params['key'];
      if (key) {
        // Cập nhật mảng và đảm bảo chỉ lấy đủ 20 ký tự
        const chars = key.split('');
        for (let i = 0; i < 20; i++) {
          this.keyArray[i] = chars[i] || '';
        }
      }
    });
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    // Chỉ lấy ký tự cuối cùng nếu người dùng gõ đè
    if (val.length > 1) {
      this.keyArray[index] = val.slice(-1);
    }

    // Nếu gõ xong 1 ký tự, tự động focus ô tiếp theo
    if (val && index < 19) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Nếu nhấn Backspace khi ô đang trống, quay lại ô trước đó
    if (event.key === 'Backspace' && !this.keyArray[index] && index > 0) {
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  // Hàm lấy toàn bộ chuỗi từ 20 ô vuông để gửi lên Server
  getFullKey(): string {
    return this.keyArray.join('').trim();
  }

  // Hàm xử lý khi người dùng dán (Paste) mã vào ô
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Chặn hành vi dán mặc định (chỉ vào 1 ô)

    const pastedData = event.clipboardData?.getData('text').trim();

    if (pastedData) {
      // Chuyển chuỗi vừa dán thành mảng ký tự
      const chars = pastedData.split('');

      // Đổ từng ký tự vào mảng keyArray (tối đa 20)
      for (let i = 0; i < 20; i++) {
        if (chars[i]) {
          this.keyArray[i] = chars[i];
        }
      }

      // Sau khi dán xong, tự động nhảy con trỏ về ô cuối cùng
      setTimeout(() => {
        if (this.inputs && this.inputs.last) {
          this.inputs.last.nativeElement.focus();
        }
      }, 0);
    }
  }

  onConfirm() {
    const finalKey = this.keyArray.join('');
    if (finalKey.length < 20) {
      this.toast.show('Mã kích hoạt chưa đủ 20 ký tự!', 'error');
      return;
    }

    console.log(finalKey);
    this.authService.activateAccount(finalKey).subscribe({
      next: () => {
        this.toast.show('Kích hoạt thành công! Đang chuyển hướng...', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show('Mã kích hoạt không hợp lệ hoặc đã hết hạn', 'error');
      }
    });
  }
}