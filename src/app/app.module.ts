import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// used to create fake backend
// import { fakeBackendProvider } from "./_helpers";

import { AppComponent } from "./app.component";
import { appRoutingModule } from "./app.routing";

import { JwtInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { MatSliderModule } from "@angular/material/slider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ToastrModule } from "ngx-toastr";
import { ImageUploadModule } from "angular2-image-upload";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { DialogUpdateItemComponent } from "./dialog-update-item/dialog-update-item.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DialogDeleteItemComponent } from "./dialog-delete-item/dialog-delete-item.component";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { DialogEncuestaComponent } from "./dialog-encuesta/dialog-encuesta.component";

@NgModule({
   imports: [
      BrowserModule,
      ReactiveFormsModule,
      HttpClientModule,
      appRoutingModule,
      MatSliderModule,
      MatProgressSpinnerModule,
      MatExpansionModule,
      MatFormFieldModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatCardModule,
      FormsModule,
      MatButtonModule,
      MatTableModule,
      MatIconModule,
      MatDialogModule,
      MatProgressBarModule,
      MatListModule,
      MatCheckboxModule,
      MatRadioModule,
      ImageUploadModule.forRoot(),
      ToastrModule.forRoot()
   ],
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      DialogUpdateItemComponent,
      DialogDeleteItemComponent,
      DialogEncuestaComponent
   ],
   entryComponents: [
      DialogUpdateItemComponent,
      DialogDeleteItemComponent,
      DialogEncuestaComponent
   ],
   providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

      // provider used to create fake backend
      // fakeBackendProvider
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
