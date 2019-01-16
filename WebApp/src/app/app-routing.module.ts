import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RuleViewComponent } from "./rule-view/rule-view.component";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { AllDevicesComponent } from "./all-devices/all-devices.component";
import { EditDeviceComponent } from "./edit-device/edit-device.component";
import { DeviceDetailsComponent } from "./device-details/device-details.component";
import { EditAuthGuard } from "./edit-auth.guard";
import { DeviceRegisterComponent } from "./device-register/device-register.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "all_devices",
    component: AllDevicesComponent,
    canActivate: [AuthGuard]
  },
  { path: "rule", component: RuleViewComponent },
  { path: "register", component: UserRegisterComponent },
  { path: "login", component: LoginComponent },
  {
    path: "register_device",
    component: DeviceRegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "devices/edit/:id",
    component: EditDeviceComponent,
    canActivate: [AuthGuard, EditAuthGuard]
  },
  {
    path: "devices/details/:id",
    component: DeviceDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
