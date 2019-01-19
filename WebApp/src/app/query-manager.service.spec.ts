import { TestBed } from "@angular/core/testing";

import { QueryManagerService } from "./query-manager.service";

describe("QueryManagerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: QueryManagerService = TestBed.get(QueryManagerService);
    expect(service).toBeTruthy();
  });
});
