import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent {
  readonly stats = [
    { label: 'Posts', value: '100', icon: 'posts', color: 'indigo' },
    { label: 'Usuários', value: '10', icon: 'users', color: 'violet' },
    { label: 'Comentários', value: '500', icon: 'comments', color: 'cyan' },
  ];

  readonly features = [
    {
      title: 'Explorar Posts',
      description: 'Navegue pelos 100 posts disponíveis, pesquise por título e veja os detalhes completos com comentários.',
      route: '/posts',
      label: 'Ver Posts',
      color: 'indigo',
    },
    {
      title: 'Explorar Usuários',
      description: 'Conheça os 10 usuários da API, seus dados de contato, empresa e todos os posts que publicaram.',
      route: '/users',
      label: 'Ver Usuários',
      color: 'violet',
    },
  ];
}
