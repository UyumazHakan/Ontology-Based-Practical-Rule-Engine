import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AlertService } from "./alert.service";
import { DeviceService } from "./device.service";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EditAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private deviceService: DeviceService,
    private alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var device_id = route.params["id"];
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return this.deviceService.getById(device_id).pipe(
      map(data => {
        if (currentUser && currentUser["username"] === data["created_by"]) {
          return true;
        }
        this.router.navigate(["/devices/details/" + device_id]);
        this.alertService.error("You can't edit other user's devices");
        return false;
      }),
      catchError(err => {
        this.router.navigate(["/all_devices"]);
        this.alertService.error(err);
        return of(false);
      })
    );
  }
}
