import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComexstatService {
  private url = 'https://api-comexstat.mdic.gov.br/general?language=pt';

  constructor(private http: HttpClient) { }

  getExportacoesPorAnoMes() {
    const payload = {
      flow: 'export',
      monthDetail: true,
      period: { from: '2014-01', to: '2025-07' },    
      metrics: ['metricFOB']
    };
    return this.http.post<any>(this.url, payload).pipe(
      map((res: { data: { list: any[]; }; }) => res.data.list.map((item: any) => ({
        year: item.year,
        month: item.monthNumber,
        value: Number(item.metricFOB)
      })))
    );
  }

  getImportacoesPorAnoMes() {
    const payload = {
      flow: 'import',
      monthDetail: true,
      period: { from: '2014-01', to: '2025-07' },  
      metrics: ['metricFOB']
    };
    return this.http.post<any>(this.url, payload).pipe(
      map((res: { data: { list: any[]; }; }) => 
        res.data.list.map((item: any) => ({
        year: item.year,
        month: item.monthNumber,
        value: Number(item.metricFOB)
      }))
    )
    );
  }

  getExportacoesPorPais(start: string, end: string): Observable<any[]> {
  const url = 'https://api-comexstat.mdic.gov.br/general?language=en';
  const payload = {
    flow: "export",
    monthDetail: false,
    period: { from: start, to: end },
    details: ["country"],
    metrics: ["metricFOB"]
  };

  return this.http.post<any>(url, payload).pipe(
    map((res: { data: { list: never[]; }; }) => {
      const data = res?.data?.list ?? [];
      return data.map((item: any) => ({
        country:  item.country,
        value: +item.metricFOB
      }));
    })
  );
  
}

}