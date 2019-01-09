import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RuleSidebarToolboxComponent } from "./rule-sidebar-toolbox.component";

describe("RuleSidebarToolboxComponent", () => {
  let component: RuleSidebarToolboxComponent;
  let fixture: ComponentFixture<RuleSidebarToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RuleSidebarToolboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSidebarToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
