import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportacaoAnoComponent } from './exportacao-ano.component';

describe('ExportacaoAnoComponent', () => {
  let component: ExportacaoAnoComponent;
  let fixture: ComponentFixture<ExportacaoAnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportacaoAnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportacaoAnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
