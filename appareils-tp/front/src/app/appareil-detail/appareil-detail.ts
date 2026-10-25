import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppareilData } from '../models/appareil.model';
import { AppareilService } from '../services/appareil';

@Component({
  selector: 'app-appareil-detail',
  imports: [RouterLink],
  templateUrl: './appareil-detail.html',
})
export class AppareilDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private appareilService = inject(AppareilService);

  appareil = signal<AppareilData | null>(null);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.appareilService.getAppareil(id).subscribe({
      next: (a) => this.appareil.set(a),
      error: () => this.error.set('Appliance not found'),
    });
  }
}
