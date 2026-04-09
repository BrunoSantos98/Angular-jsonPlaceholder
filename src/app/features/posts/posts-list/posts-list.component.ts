import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})

export class PostsListComponent implements OnInit {
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  posts = signal<Post[]>([]);
  users = signal<Map<number, User>>(new Map());
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');

  readonly currentPage = signal(1);
  readonly pageSize = 12;

  filteredPosts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return query
      ? this.posts().filter((p) => p.title.toLowerCase().includes(query))
      : this.posts();
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredPosts().length / this.pageSize)
  );

  pagedPosts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPosts().slice(start, start + this.pageSize);
  });

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    forkJoin({
      posts: this.postService.getPosts(),
      users: this.userService.getUsers(),
    }).subscribe({
      next: ({ posts, users }) => {
        this.posts.set(posts);
        this.users.set(new Map(users.map((u) => [u.id, u])));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Falha ao carregar os dados. Tente novamente.');
        this.loading.set(false);
      },
    });
  }

  getUserName(userId: number): string {
    return this.users().get(userId)?.name ?? `Usuário ${userId}`;
  }

  getUserInitials(userId: number): string {
    const name = this.users().get(userId)?.name ?? '';
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?';
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getAvatarColor(userId: number): string {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
      '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
    ];
    return colors[(userId - 1) % colors.length];
  }
}
