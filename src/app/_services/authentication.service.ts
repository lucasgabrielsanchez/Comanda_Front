import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "@environments/environment";
import { User } from "@app/_models";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
   private currentUserSubject: BehaviorSubject<User>;
   public currentUser: Observable<User>;
   private jwtHelper: JwtHelperService = new JwtHelperService();

   constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(
         JSON.parse(localStorage.getItem("currentUser"))
      );
      this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): User {
      return this.currentUserSubject.value;
   }

   login(email: string, clave: string) {
      var formData: any = new FormData();
      formData.append("email", email);
      formData.append("clave", clave);

      return (
         this.http
            // .post<any>(`${environment.apiUrl}/users/authenticate`, {
            //    email,
            //    clave
            // })
            .post<any>(`${environment.apiUrl}/ingreso/`, formData)
            .pipe(
               map(user => {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem("currentUser", JSON.stringify(user));
                  this.currentUserSubject.next(user);
                  return user;
               })
            )
      );
   }

   logout() {
      // remove user from local storage to log user out
      localStorage.removeItem("currentUser");
      this.currentUserSubject.next(null);
   }

   getUserDataToken() {
      return this.jwtHelper.decodeToken(this.currentUserSubject.value.token)
         .data;
   }
}
