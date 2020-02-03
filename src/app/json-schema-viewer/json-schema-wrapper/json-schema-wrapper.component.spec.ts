import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSchemaWrapperComponent } from './json-schema-wrapper.component';

describe('JsonSchemaWrapperComponent', () => {
  let component: JsonSchemaWrapperComponent;
  let fixture: ComponentFixture<JsonSchemaWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonSchemaWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSchemaWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
