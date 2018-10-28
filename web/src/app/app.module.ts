import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RepositoriesComponent } from "./repositories/repositories.component";
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        RepositoriesComponent,
        SidebarComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
