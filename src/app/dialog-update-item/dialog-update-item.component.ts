import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl } from "@angular/forms";
import { FileHolder } from "angular2-image-upload";
import { ServicioComandaService } from "@app/_services";
import { ToastrService } from "ngx-toastr";

@Component({
   selector: "app-dialog-update-item",
   templateUrl: "./dialog-update-item.component.html",
   styleUrls: ["./dialog-update-item.component.css"]
})
export class DialogUpdateItemComponent implements OnInit {
   profileForm = new FormGroup({
      nombre: new FormControl(""),
      precio: new FormControl(""),
      sector: new FormControl(""),
      estado: new FormControl(""),
      tiempo_estimado_preparacion: new FormControl(""),
      archivo: new FormControl("")
   });
   spinnerModificarItem: boolean = false;

   constructor(
      public dialogRef: MatDialogRef<DialogUpdateItemComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _servicioComandaService: ServicioComandaService,
      private _toastr: ToastrService
   ) {}

   ngOnInit() {
      this.profileForm.controls["nombre"].setValue(this.data.nombre);
      this.profileForm.controls["precio"].setValue(this.data.precio);
      this.profileForm.controls["sector"].setValue(this.data.sector);
      this.profileForm.controls["estado"].setValue(this.data.estado);
      this.profileForm.controls["tiempo_estimado_preparacion"].setValue(
         this.data.tiempo_estimado_preparacion
      );
   }

   // convenience getter for easy access to form fields
   get f() {
      return this.profileForm.controls;
   }

   onNoClick(): void {
      this.dialogRef.close();
   }

   onUploadFinished(file: FileHolder) {
      this.profileForm.controls["archivo"].setValue(file.file);
      console.log(file);
   }

   onSubmit() {
      this.spinnerModificarItem = true;
      var formData: any = new FormData();
      formData.append("id", this.data.id); //Obtengo el ID de la data inyectada.
      formData.append("nombre", this.f.nombre.value);
      formData.append("precio", this.f.precio.value);
      formData.append("sector", this.f.sector.value);
      formData.append("estado", this.f.estado.value);
      formData.append(
         "tiempo_estimado_preparacion",
         this.f.tiempo_estimado_preparacion.value
      );
      formData.append("archivo", this.f.archivo.value);

      this._servicioComandaService.modificarItem(formData).subscribe(
         (resultado: any) => {
            this._toastr.success(resultado.msj, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });

            this.dialogRef.close(true);
         },
         error => {},
         () => {
            this.spinnerModificarItem = false;
         }
      );
   }
}
