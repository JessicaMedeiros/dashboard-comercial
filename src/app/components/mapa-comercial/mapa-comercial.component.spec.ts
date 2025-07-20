import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaComercialComponent } from './mapa-comercial.component';

describe('MapaComercialComponent', () => {
  let component: MapaComercialComponent;
  let fixture: ComponentFixture<MapaComercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaComercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
