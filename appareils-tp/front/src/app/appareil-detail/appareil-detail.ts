import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppareilService } from '../services/appareil';

@Component({
  selector: 'app-appareil-detail',
  imports: [RouterLink],
  templateUrl: './appareil-detail.html',
})
export class AppareilDetail {
  private route = inject(ActivatedRoute);
  private appareilService = inject(AppareilService);

  id = Number(this.route.snapshot.paramMap.get('id'));
  appareil = this.appareilService.appareilList[this.id];
}
