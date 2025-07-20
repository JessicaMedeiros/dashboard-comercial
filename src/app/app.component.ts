import { Component } from '@angular/core';
import { MapaComercialComponent } from './components/mapa-comercial/mapa-comercial.component';
import { ExportacaoAnoComponent } from './components/exportacao-ano/exportacao-ano.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ MapaComercialComponent, ExportacaoAnoComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'dashboard-comercial-bra-eua';
}
