import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'header-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-layout.html',
  styleUrls: ['./header-layout.css']
})
export class HeaderLayoutComponent { }