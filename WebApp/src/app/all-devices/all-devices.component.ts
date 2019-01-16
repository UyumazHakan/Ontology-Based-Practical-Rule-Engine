import { Component, OnInit } from "@angular/core";
import { Device } from "../device";
import { User } from "../user";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { DeviceService } from "../device.service";
import { AlertService } from "../alert.service";

@Component({
  selector: "app-all-devices",
  templateUrl: "./all-devices.component.html",
  styleUrls: ["./all-devices.component.scss"]
})
export class AllDevicesComponent implements OnInit {
  devices: Device[];
  loading = false;
  currentUser: User;
  is_enough_device = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private deviceService: DeviceService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  ngOnInit() {
    this.getAllDevices();
  }

  getAllDevices() {
    this.deviceService.getAll().subscribe(
      data => {
        console.log(data);
        if (data.length > 0) {
          this.devices = data;
          this.is_enough_device = true;
        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  deleteDevice(id: string) {
    this.deviceService.delete(id).subscribe(
      data => {
        if (data === "success") {
          let index = this.devices.findIndex(d => d.id === id); //find index in your array
          this.devices.splice(index, 1); //remove element from array
          this.alertService.success("Device is deleted successfully", true);
        }
      },
      error => {
        this.alertService.error(error);
      }
    );
  }
}
