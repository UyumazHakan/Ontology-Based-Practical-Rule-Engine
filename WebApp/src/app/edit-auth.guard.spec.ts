import { TestBed, async, inject } from "@angular/core/testing";

import { EditAuthGuard } from "./edit-auth.guard";

describe("EditAuthGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditAuthGuard]
    });
  });

  it("should ...", inject([EditAuthGuard], (guard: EditAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
