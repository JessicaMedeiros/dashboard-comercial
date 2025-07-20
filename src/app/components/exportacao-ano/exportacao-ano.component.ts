import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts'; // ⬅ necessário aqui!
import { ChartConfiguration } from 'chart.js';
import { ComexstatService } from '../../services/comexstat.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-exportacao-ano',
  imports: [NgChartsModule], 
  templateUrl: './exportacao-ano.component.html',
  styleUrl: './exportacao-ano.component.scss',
})
export class ExportacaoAnoComponent implements OnInit {
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Exportações (US$ FOB)',
        data: [],
        fill: true,
        tension: 0.4,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
      },
    ],
  };
  public chartType: ChartConfiguration<'line'>['type'] = 'line';
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  };


  constructor(private comexService: ComexstatService) { }

  ngOnInit(): void {

    forkJoin({
      exportacoes: this.comexService.getExportacoesPorAnoMes(),
      importacoes: this.comexService.getImportacoesPorAnoMes()
    })
    .subscribe(({ exportacoes, importacoes }: { exportacoes: Array<{ year: string, month: string, value: number }>, importacoes: Array<{ year: string, month: string, value: number }> }) => {
      // Criar labels no formato "2023-01", "2023-02"...

      console.log('Exportações:', exportacoes);
      console.log('Importações:', importacoes);

      const allMonthsSet = new Set<string>();
      exportacoes.forEach(e => allMonthsSet.add(`${e.year}-${e.month.padStart(2, '0')}`));
      importacoes.forEach(i => allMonthsSet.add(`${i.year}-${i.month.padStart(2, '0')}`));

      const allMonths = Array.from(allMonthsSet).sort();

      // Criar mapeamentos para valor rápido
      const exportMap = new Map(exportacoes.map(e => [`${e.year}-${e.month.padStart(2, '0')}`, e.value]));
      const importMap = new Map(importacoes.map(i => [`${i.year}-${i.month.padStart(2, '0')}`, i.value]));

      this.chartData = {
        labels: allMonths,
        datasets: [
          { data: allMonths.map(m => exportMap.get(m) || 0), label: 'Exportações (US$ FOB)', fill: true, tension: 0.4, borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.2)' },
          { data: allMonths.map(m => importMap.get(m) || 0), label: 'Importações (US$ FOB)', fill: true, tension: 0.4, borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.2)' }
        ]
      };

    });
  }


}
