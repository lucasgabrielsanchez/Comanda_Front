import { environment } from "@environments/environment";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "./_services";
import { User } from "./_models";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent {
   currentUser: User;
   dataUser: any;
   pathToItemPhoto: string = environment.apiUrl + "/";

   constructor(
      private router: Router,
      private authenticationService: AuthenticationService
   ) {
      this.authenticationService.currentUser.subscribe(x => {
         this.currentUser = x;
         if (this.currentUser) {
            this.dataUser = this.authenticationService.getUserDataToken();
         }
      });
   }

   logout() {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
   }
}
