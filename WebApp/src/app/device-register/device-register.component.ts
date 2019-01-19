import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { AlertService } from "../alert.service";
import { DeviceService } from "../device.service";
import { QueryManagerService } from "../query-manager.service";

@Component({
  selector: "app-device-register",
  templateUrl: "./device-register.component.html",
  styleUrls: ["./device-register.component.scss"]
})
export class DeviceRegisterComponent implements OnInit {
  model: any = {
    id: "",
    name: "",
    created_by: "",
    description: "",
    board_type: "raspberry_pi"
  };

  loading = false;
  currentUser: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private deviceService: DeviceService,
    private queryManager: QueryManagerService
  ) {
    this.currentUser = userService.currentUser;
    this.model.created_by = this.currentUser.username;
  }

  // ref: https://stackoverflow.com/questions/26501688/a-typescript-guid-class
  public registerDevice() {
    this.model.id = this.newGuid();
    this.loading = true;

    this.deviceService.create(this.model).then(o =>
      o.subscribe(
        data => {
          this.loading = false;
          this.router.navigate(["/all_devices"]);
          alert("Device is registered successfully");
          this.alertService.success("Device is registered successfully");
        },
        error2 => {
          this.loading = false;
          console.log(error2);
          alert("Error occurred: " + error2.message);
          this.alertService.error(error2.message);
        }
      )
    );
  }

  public newGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  ngOnInit(): void {}
}
