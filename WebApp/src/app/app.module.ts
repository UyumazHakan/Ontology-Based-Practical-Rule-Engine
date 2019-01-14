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
  MatIconModule
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

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MainViewComponent,
    RuleViewComponent,
    RuleGraphViewComponent,
    RuleSidebarComponent,
    NodeEditComponent,
    RuleSidebarToolboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
