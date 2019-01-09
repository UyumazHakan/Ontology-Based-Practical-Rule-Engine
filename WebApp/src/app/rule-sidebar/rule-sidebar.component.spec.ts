import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RuleSidebarComponent } from "./rule-sidebar.component";

describe("RuleSidebarComponent", () => {
  let component: RuleSidebarComponent;
  let fixture: ComponentFixture<RuleSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RuleSidebarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
