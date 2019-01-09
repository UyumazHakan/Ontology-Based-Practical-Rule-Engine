import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RuleGraphViewComponent } from "./rule-graph-view.component";

describe("RuleGraphViewComponent", () => {
  let component: RuleGraphViewComponent;
  let fixture: ComponentFixture<RuleGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RuleGraphViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
