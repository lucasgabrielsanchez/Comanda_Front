import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
   FormGroup,
   FormControl,
   FormBuilder,
   Validators
} from "@angular/forms";
import { FileHolder } from "angular2-image-upload";
import { ServicioComandaService } from "@app/_services";
import { ToastrService } from "ngx-toastr";

@Component({
   selector: "app-dialog-encuesta",
   templateUrl: "./dialog-encuesta.component.html",
   styleUrls: ["./dialog-encuesta.component.css"]
})
export class DialogEncuestaComponent implements OnInit {
   registerForm: FormGroup;
   loadingRegister = false;
   submitted2 = false;

   constructor(
      public dialogRef: MatDialogRef<DialogEncuestaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _servicioComandaService: ServicioComandaService,
      private _toastr: ToastrService,
      private formBuilder: FormBuilder
   ) {}

   ngOnInit() {
      this.registerForm = this.formBuilder.group({
         mesa: ["", Validators.required],
         restaurante: ["", Validators.required],
         mozo: ["", Validators.required],
         cocinero: ["", Validators.required],
         bartender: ["", Validators.required],
         cervecero: ["", Validators.required],
         precio_calidad: ["", Validators.required],
         descripcion: [""]
      });
   }

   // convenience getter for easy access to form fields
   get fr() {
      return this.registerForm.controls;
   }

   onNoClick(): void {
      this.dialogRef.close();
   }

   onSubmit2() {
      this.submitted2 = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
         return;
      }

      this.loadingRegister = true;

      var formData: any = new FormData();
      formData.append("mesa", this.fr.mesa.value);
      formData.append("restaurante", this.fr.restaurante.value);
      formData.append("mozo", this.fr.mozo.value);
      formData.append("cocinero", this.fr.cocinero.value);
      formData.append("bartender", this.fr.bartender.value);
      formData.append("cervecero", this.fr.cervecero.value);
      formData.append("precio_calidad", this.fr.precio_calidad.value);
      formData.append("descripcion", this.fr.descripcion.value);
      formData.append("pedido_id", this.data);

      this._servicioComandaService.cargarEncuesta(formData).subscribe(
         (resultado: any) => {
            this._toastr.success(resultado.mensaje, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });
            this.loadingRegister = false;
            // this.profileForm.reset();
         },
         error => {
            this._toastr.error(
               "Se produjo un error al enviar la encuesta",
               "",
               {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               }
            );
            this.loadingRegister = false;
         }
      );
   }
}
