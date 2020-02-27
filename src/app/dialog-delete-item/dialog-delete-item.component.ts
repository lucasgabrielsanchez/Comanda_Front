import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ServicioComandaService } from "@app/_services";
import { ToastrService } from "ngx-toastr";
import { HttpParams } from "@angular/common/http";

@Component({
   selector: "app-dialog-delete-item",
   templateUrl: "./dialog-delete-item.component.html",
   styleUrls: ["./dialog-delete-item.component.css"]
})
export class DialogDeleteItemComponent implements OnInit {
   spinnerEliminarItem: boolean = false;

   constructor(
      public dialogRef: MatDialogRef<DialogDeleteItemComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _servicioComandaService: ServicioComandaService,
      private _toastr: ToastrService
   ) {}

   onNoClick(): void {
      this.dialogRef.close();
   }

   ngOnInit() {}

   eliminarItem() {
      this.spinnerEliminarItem = true;

      this._servicioComandaService.eliminarItem(this.data.id).subscribe(
         (resultado: any) => {
            this._toastr.success(resultado.resultado, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });

            this.dialogRef.close(true);
         },
         error => {
            this.spinnerEliminarItem = false;
         },
         () => {
            this.spinnerEliminarItem = false;
         }
      );
   }
}
