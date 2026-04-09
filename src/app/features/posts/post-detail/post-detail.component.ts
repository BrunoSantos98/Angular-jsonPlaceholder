import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { CommentService } from '../../../core/services/comment.service';
import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { Comment } from '../../../core/models/comment.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);
  private readonly commentService = inject(CommentService);

  post = signal<Post | null>(null);
  user = signal<User | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  commentsExpanded = signal(true);

  avatarColor = computed(() => {
    const id = this.user()?.id ?? 1;
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
      '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
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
      post: this.postService.getPost(id),
      comments: this.commentService.getCommentsByPost(id),
    }).subscribe({
      next: ({ post, comments }) => {
        this.post.set(post);
        this.comments.set(comments);
        this.userService.getUser(post.userId).subscribe({
          next: (u) => { this.user.set(u); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
      },
      error: () => {
        this.error.set('Falha ao carregar o post.');
        this.loading.set(false);
      },
    });
  }

  toggleComments(): void {
    this.commentsExpanded.update((v) => !v);
  }

  getCommentInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?';
  }
}
