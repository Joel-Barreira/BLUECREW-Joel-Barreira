import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutDashboard, Users, CalendarDays, Newspaper, MessageSquare, Bot, LogOut, Menu, X } from 'lucide-angular';
import { Chatbot } from '../../features/chatbot/chatbot';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LucideAngularModule, Chatbot],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly CalendarDays = CalendarDays;
  readonly Newspaper = Newspaper;
  readonly MessageSquare = MessageSquare;
  readonly Bot = Bot;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;

  isSidebarOpen = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  get currentUser() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
