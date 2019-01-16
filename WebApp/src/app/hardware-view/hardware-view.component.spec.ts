import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HardwareViewComponent } from "./hardware-view.component";

describe("HardwareViewComponent", () => {
  let component: HardwareViewComponent;
  let fixture: ComponentFixture<HardwareViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HardwareViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
