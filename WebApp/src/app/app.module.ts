import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatInputModule,
  MatSelectModule,
  MatChipsModule,
  MatIconModule,
  MatListModule
} from "@angular/material";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { MainViewComponent } from "./main-view/main-view.component";
import { RuleViewComponent } from "./rule-view/rule-view.component";
import { RuleGraphViewComponent } from "./rule-graph-view/rule-graph-view.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RuleSidebarComponent } from "./rule-sidebar/rule-sidebar.component";
import { NodeEditComponent } from "./node-edit/node-edit.component";
import { RuleSidebarToolboxComponent } from "./rule-sidebar-toolbox/rule-sidebar-toolbox.component";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { HardwareViewComponent } from "./hardware-view/hardware-view.component";
import { UserService } from "./user.service";
import { AlertService } from "./alert.service";
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from "./login/login.component";
import { AllDevicesComponent } from "./all-devices/all-devices.component";
import { EditDeviceComponent } from "./edit-device/edit-device.component";
import { DeviceDetailsComponent } from "./device-details/device-details.component";
import { JwtInterceptorProvider } from "./jwt-interceptor";
import { DeviceRegisterComponent } from "./device-register/device-register.component";
import { OntologyDetailsComponent } from "./ontology-details/ontology-details.component";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MainViewComponent,
    RuleViewComponent,
    RuleGraphViewComponent,
    RuleSidebarComponent,
    NodeEditComponent,
    RuleSidebarToolboxComponent,
    UserRegisterComponent,
    HardwareViewComponent,
    LoginComponent,
    AllDevicesComponent,
    EditDeviceComponent,
    DeviceDetailsComponent,
    DeviceRegisterComponent,
    OntologyDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [UserService, AlertService, JwtInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
