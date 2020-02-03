import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSchemaViewerSecondComponent } from './json-schema-viewer-second.component';

describe('JsonSchemaViewerSecondComponent', () => {
  let component: JsonSchemaViewerSecondComponent;
  let fixture: ComponentFixture<JsonSchemaViewerSecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonSchemaViewerSecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSchemaViewerSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
