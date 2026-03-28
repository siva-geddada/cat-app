import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMatch } from './cat-match';

describe('CatMatch', () => {
  let component: CatMatch;
  let fixture: ComponentFixture<CatMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
