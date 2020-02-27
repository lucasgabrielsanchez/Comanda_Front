import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "@app/_services";
import { FileHolder } from "angular2-image-upload";
import { ServicioComandaService } from "@app/_services";
import { ToastrService } from "ngx-toastr";

@Component({ templateUrl: "login.component.html" })
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
   loading = false;
   loadingRegister = false;
   submitted = false;
   submitted2 = false;
   returnUrl: string;
   error = "";
   isLogin: boolean = true;
   registerForm: FormGroup;

   constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private _servicioComandaService: ServicioComandaService,
      private _toastr: ToastrService
   ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
         this.router.navigate(["/"]);
      }
   }

   ngOnInit() {
      this.loginForm = this.formBuilder.group({
         username: ["", Validators.required],
         password: ["", Validators.required]
      });

      this.registerForm = this.formBuilder.group({
         nombre: ["", Validators.required],
         apellido: ["", Validators.required],
         email: ["", Validators.required],
         clave: ["", Validators.required],
         archivo: ["", Validators.required]
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
   }

   // convenience getter for easy access to form fields
   get f() {
      return this.loginForm.controls;
   }

   get fr() {
      return this.registerForm.controls;
   }

   onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
         return;
      }

      this.loading = true;
      this.authenticationService
         .login(this.f.username.value, this.f.password.value)
         .pipe(first())
         .subscribe(
            data => {
               this.router.navigate([this.returnUrl]);
            },
            error => {
               if (error.error && error.error.acceso) {
                  this.error = error.error.acceso;
               } else {
                  this.error = error.statusText;
               }
               this.loading = false;
            }
         );
   }

   onSubmit2() {
      this.submitted2 = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
         return;
      }

      this.loadingRegister = true;

      var formData: any = new FormData();
      formData.append("nombre", this.fr.nombre.value);
      formData.append("apellido", this.fr.apellido.value);
      formData.append("email", this.fr.email.value);
      formData.append("clave", this.fr.clave.value);
      formData.append("archivo", this.fr.archivo.value);

      this._servicioComandaService.cargarCliente(formData).subscribe(
         (resultado: any) => {
            this._toastr.success(resultado.respuesta, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });
            this.loadingRegister = false;
            // this.profileForm.reset();
         },
         error => {
            this.loadingRegister = false;
         }
      );
   }

   cargarUsuario(email: string, clave: string) {
      this.f.username.setValue(email);
      this.f.password.setValue(clave);
   }

   onUploadFinished(file: FileHolder) {
      this.registerForm.controls["archivo"].setValue(file.file);
   }
}
