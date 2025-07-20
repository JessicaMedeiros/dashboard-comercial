import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { ComexstatService } from '../../services/comexstat.service';
import worldGeoJSON from '../../../assets/paises.json';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mapa-comercial',
  templateUrl: './mapa-comercial.component.html',
  styleUrls: ['./mapa-comercial.component.scss'],
  standalone: true
})
export class MapaComercialComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private geoJSONLayer!: L.GeoJSON;
  private exportData: Map<string, number> = new Map();
  private dataSubscription!: Subscription;
  private initialized = false;

  constructor(
    private comexService: ComexstatService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    if (!this.initialized) {
      this.initMap();
      this.loadExportData();
      this.initialized = true;
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initMap(): void {
    const mapContainer = this.elementRef.nativeElement.querySelector('#map');
    
    this.map = L.map(mapContainer, {
      center: [20, 0],
      zoom: 2,
      maxZoom: 5,
      minZoom: 2,
      worldCopyJump: false, // Impede repetição do mapa
      preferCanvas: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      noWrap: true // Evita repetição de tiles
    }).addTo(this.map);

    this.createBaseGeoJSONLayer();
  }

  private createBaseGeoJSONLayer(): void {
    // Remove camada existente se houver
    if (this.geoJSONLayer) {
      this.map.removeLayer(this.geoJSONLayer);
    }

    // Filtra features únicas baseadas em um ID (usando ISO_A3 como exemplo)
    const uniqueFeatures = this.getUniqueFeatures((worldGeoJSON as any).features);

    this.geoJSONLayer = L.geoJSON(uniqueFeatures, {
      style: (feature) => this.getCountryStyle(feature),
      onEachFeature: (feature, layer) => this.setupCountryInteraction(feature, layer)
    }).addTo(this.map);
  }

  private getUniqueFeatures(features: any[]): any[] {
    const uniqueIds = new Set();
    return features.filter(feature => {
      const id = feature.properties?.ISO_A3 || feature.id;
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        return true;
      }
      return false;
    });
  }

  private loadExportData(): void {
    this.dataSubscription = this.comexService.getExportacoesPorPais('2025-01', '2025-03')
      .subscribe(data => {
        this.processExportData(data);
        this.updateMapStyles();
      });
  }

  private processExportData(exportacoes: any[]): void {
    this.exportData.clear();
    exportacoes.forEach(e => {
      const countryName = e.country;
      this.exportData.set(countryName, e.value);
    });
  }

  private updateMapStyles(): void {
    if (!this.geoJSONLayer) return;

    this.geoJSONLayer.setStyle(feature => this.getCountryStyle(feature));
    this.geoJSONLayer.eachLayer(layer => {
      const feature = (layer as any).feature;
      if (feature) {
        const countryName = feature.properties.name;
        const exportValue = this.exportData.get(countryName);
        if (exportValue !== undefined) {
          layer.bindPopup(this.createCountryPopup(countryName, exportValue));
        }
      }
    });
  }

  private getCountryStyle(feature: any): L.PathOptions {
    const countryName = feature.properties.name;
    const exportValue = this.exportData.get(countryName) || 0;
    
    return {
      fillColor: this.getColorByValue(exportValue),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8,
      className: 'country-path' // Classe CSS adicional
    };
  }

  private setupCountryInteraction(feature: any, layer: L.Layer): void {
    const countryName = feature.properties.name;
    const exportValue = this.exportData.get(countryName);
    
    if (exportValue !== undefined) {
      layer.bindPopup(this.createCountryPopup(countryName, exportValue));
      layer.on({
        mouseover: (e) => this.highlightFeature(e),
        mouseout: (e) => this.resetHighlight(e),
        click: (e) => this.zoomToFeature(e)
      });
    }
  }

  private highlightFeature(e: L.LeafletEvent): void {
    const layer = e.target as L.Path;
    layer.setStyle({
      weight: 3,
      color: '#555',
      fillOpacity: 0.9
    });
    layer.bringToFront();
  }

  private resetHighlight(e: L.LeafletEvent): void {
    const layer = e.target as L.Path;
    this.geoJSONLayer?.resetStyle(layer);
  }

  private zoomToFeature(e: L.LeafletEvent): void {
    this.map?.fitBounds(e.target.getBounds(), { padding: [50, 50] });
  }

  private createCountryPopup(countryName: string, value: number): string {
    return `<div class="country-popup">
              <h4>${countryName}</h4>
              <p>Exportações: <strong>US$ ${(value / 1e9).toFixed(2)} bi</strong></p>
            </div>`;
  }

  private getColorByValue(valor: number): string {
    // Sua escala de cores existente
    return valor > 10_000_000_000 ? '#08306b' :
      valor > 5_000_000_000 ? '#2171b5' :
        valor > 1_000_000_000 ? '#6baed6' :
          valor > 500_000_000 ? '#c6dbef' :
            valor > 0 ? '#deebf7' :
              '#f7f7f7';
  }

  private cleanup(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}