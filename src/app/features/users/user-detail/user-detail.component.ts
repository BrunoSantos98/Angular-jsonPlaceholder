import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { PostService } from '../../../core/services/post.service';
import { User } from '../../../core/models/user.model';
import { Post } from '../../../core/models/post.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly postService = inject(PostService);

  user = signal<User | null>(null);
  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  avatarColor = computed(() => {
    const id = this.user()?.id ?? 1;
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
      '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
      '#f97316', '#84cc16',
    ];
    return colors[(id - 1) % colors.length];
  });

  userInitials = computed(() => {
    const name = this.user()?.name ?? '';
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?';
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      user: this.userService.getUser(id),
      posts: this.postService.getPostsByUser(id),
    }).subscribe({
      next: ({ user, posts }) => {
        this.user.set(user);
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Falha ao carregar o usuário.');
        this.loading.set(false);
      },
    });
  }
}
