import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { AlertService } from "../alert.service";

@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styleUrls: ["./user-register.component.scss"]
})
export class UserRegisterComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  register() {
    this.loading = true;
    this.userService.create(this.model).subscribe(
      data => {
        this.alertService.success("Registration successful", true);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {}
}
