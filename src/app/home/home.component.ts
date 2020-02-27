import { environment } from "@environments/environment";
import { Component } from "@angular/core";
import { ServicioComandaService } from "@app/_services";
import { FormGroup, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FileHolder } from "angular2-image-upload";
import { MatDialog } from "@angular/material/dialog";
import { DialogUpdateItemComponent } from "../dialog-update-item/dialog-update-item.component";
import { DialogDeleteItemComponent } from "../dialog-delete-item/dialog-delete-item.component";
import { DialogEncuestaComponent } from "../dialog-encuesta/dialog-encuesta.component";
import {
   animate,
   state,
   style,
   transition,
   trigger
} from "@angular/animations";
import { interval, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AuthenticationService } from "@app/_services";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
   selector: "home-component",
   templateUrl: "./home.component.html",
   styleUrls: ["./home.component.css"],
   animations: [
      trigger("detailExpand", [
         state("collapsed", style({ height: "0px", minHeight: "0" })),
         state("expanded", style({ height: "*" })),
         transition(
            "expanded <=> collapsed",
            animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
         )
      ])
   ]
})
export class HomeComponent {
   profileForm = new FormGroup({
      nombre: new FormControl(""),
      precio: new FormControl(""),
      sector: new FormControl(""),
      estado: new FormControl(""),
      tiempo_estimado_preparacion: new FormControl(""),
      archivo: new FormControl("")
   });
   displayedColumns: string[] = [
      "nombre",
      "precio",
      "sector",
      "estado",
      "tiempo",
      "foto",
      "acciones"
   ];
   displayedColumnsPedidoSector: string[] = [
      "id_comanda",
      "estado",
      "nombre",
      "cantidad",
      "foto",
      "acciones"
   ];
   displayedColumnsPedidoSectorSinAcciones: string[] = [
      "nombre",
      "cantidad",
      "foto",
      "sector",
      "empleado",
      "estado"
   ];
   displayedColumnsPedido: string[] = [
      "id_comanda",
      "codigo_mesa",
      "estado",
      "fecha_hora_inicio",
      "tiempo_estimado_preparacion_minutos",
      "fecha_hora_fin",
      "cliente",
      "cliente_foto"
   ];
   displayedColumnsPedidoAdmin: string[] = [
      "id_comanda",
      "codigo_mesa",
      "estado",
      "fecha_hora_inicio",
      "tiempo_estimado_preparacion_minutos",
      "fecha_hora_fin",
      "cliente",
      "cliente_foto",
      "acciones"
   ];
   displayedColumnsPedidoCliente: string[] = [
      "id_comanda",
      "codigo_mesa",
      "estado",
      "fecha_hora_inicio",
      "tiempo_estimado_preparacion_minutos",
      "fecha_hora_fin",
      "encuesta"
   ];
   displayedColumnsReporteIngreso: string[] = [
      "Fecha_Hora_Ingreso",
      "nombre",
      "apellido",
      "perfil"
   ];
   displayedColumnsOperacionesSector: string[] = ["SECTOR", "CANTIDAD"];
   displayedColumnsOperacionesSectorYEmpleado: string[] = [
      "nombre",
      "apellido",
      "SECTOR",
      "CANTIDAD"
   ];
   displayedColumnsProductoVendido: string[] = [
      "nombre",
      "CANTIDAD",
      "precio",
      "sector",
      "tiempo_estimado_preparacion"
   ];
   displayedColumnsEncuestas: string[] = [
      "id_comanda",
      "mesa",
      "restaurante",
      "mozo",
      "cocinero",
      "bartender",
      "cervecero",
      "precio_calidad",
      "descripcion"
   ];
   displayedColumnsPedidosDemorados: string[] = ["comanda", "demora"];
   loading = false;
   panelOpenState = false;
   items: any;
   itemsCliente: any;
   pathToItemPhoto: string = environment.apiUrl + "/";
   spinnerTraerItems: boolean = false;
   spinnerCargarItem: boolean = false;
   spinnerTraerMesas: boolean = false;
   spinnerTraerPedidosSector: boolean = false;
   spinnerTraerPedidos: boolean = false;
   spinnerTraerClientes: boolean = false;
   spinnerAsignTable: boolean = false;
   spinnerTraerMesasCliente: boolean = false;
   spinnerTraerPedidosCliente: boolean = false;
   spinnerTraerReportes: boolean = false;
   spinnerTraerEncuestas: boolean = false;
   itemsPedido = [];
   mesas: any;
   mesaElegida: any;
   mesaAsignada: any;
   pedidosSector: any;
   pedidos: any;
   pedidosCliente: any;
   pedidosFiltrados: any;
   flagCargarPedido: boolean = false;
   expandedElement: any;
   expandedElementEdit: any;
   subscriptionTraerPedidos: Subscription;
   filtroDeseado: string = " ";
   clientes: any;
   clienteElegidoMesa: any;
   dataUserForHome: any;
   reportes: any;
   encuestas: any;

   constructor(
      private _servicioComandaService: ServicioComandaService,
      private _toastr: ToastrService,
      public dialog: MatDialog,
      private _authenticationService: AuthenticationService
   ) {
      this.expandedElement = { id_comanda: "saraza" };
      this.expandedElementEdit = { id_comanda: "saraza" };
      this.dataUserForHome = this._authenticationService.getUserDataToken();
   }

   ngOnInit() {}

   // convenience getter for easy access to form fields
   get f() {
      return this.profileForm.controls;
   }

   traerItems() {
      this.spinnerTraerItems = true;
      // interval(3000)
      //    .pipe(startWith(0))
      //    .subscribe(() => {
      this._servicioComandaService.traerTodosLosItems().subscribe(
         resultado => {
            this.items = resultado;
            this.spinnerTraerItems = false;
         },
         error => {
            this.spinnerTraerItems = false;
         }
      );
      // });
   }

   traerItemsCliente() {
      this.spinnerTraerItems = true;
      // interval(3000)
      //    .pipe(startWith(0))
      //    .subscribe(() => {
      this._servicioComandaService.traerTodosLosItemsCliente().subscribe(
         resultado => {
            this.itemsCliente = resultado;
            this.itemsCliente = this.itemsCliente.filter(
               item => item.estado === "activo"
            );
            this.spinnerTraerItems = false;
         },
         error => {
            this.spinnerTraerItems = false;
         }
      );
      // });
   }

   onSubmit() {
      this.spinnerCargarItem = true;
      var formData: any = new FormData();
      formData.append("nombre", this.f.nombre.value);
      formData.append("precio", this.f.precio.value);
      formData.append("sector", this.f.sector.value);
      formData.append("estado", this.f.estado.value);
      formData.append(
         "tiempo_estimado_preparacion",
         this.f.tiempo_estimado_preparacion.value
      );
      formData.append("archivo", this.f.archivo.value);

      this._servicioComandaService
         // .guardarItem(this.profileForm.value)
         .guardarItem(formData)
         .subscribe(
            (resultado: any) => {
               this._toastr.success(resultado.respuesta, "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });

               this.profileForm.reset();
            },
            error => {},
            () => {
               this.spinnerCargarItem = false;
            }
         );
   }

   onUploadFinished(file: FileHolder) {
      this.profileForm.controls["archivo"].setValue(file.file);
   }

   openDialog(item: any): void {
      const dialogRef = this.dialog.open(DialogUpdateItemComponent, {
         width: "500px",
         data: item
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result === true) {
            this.traerItems();
         }
      });
   }

   openDialogDelete(item: any): void {
      const dialogRef = this.dialog.open(DialogDeleteItemComponent, {
         width: "500px",
         data: item
      });

      dialogRef.afterClosed().subscribe(result => {
         if (result === true) {
            this.traerItems();
         }
      });
   }

   openDialogEncuesta(pedido_id: any): void {
      const dialogRef = this.dialog.open(DialogEncuestaComponent, {
         width: "600px",
         data: pedido_id
      });

      // dialogRef.afterClosed().subscribe(result => {
      //    if (result === true) {
      //       this.traerItems();
      //    }
      // });
   }

   cargarItemPedido(item: any) {
      let hayCoincidencia: boolean = false;

      this.itemsPedido.forEach(element => {
         if (element.nombre === item.nombre) {
            element.cantidad += 1;
            hayCoincidencia = true;
         }
      });
      if (!hayCoincidencia) {
         item.cantidad = 1;
         this.itemsPedido.push(item);
      }
   }

   quitarItemPedido(item: any) {
      this.itemsPedido.forEach((element, i) => {
         if (element.nombre === item.nombre) {
            if (element.cantidad > 1) {
               item.cantidad -= 1;
            } else {
               this.itemsPedido.splice(i, 1);
            }
         }
      });
   }

   traerMesas() {
      this.spinnerTraerMesas = true;
      this._servicioComandaService.traerTodasLasMesas().subscribe(
         resultado => {
            this.mesas = resultado;
         },
         error => {},
         () => {
            this.spinnerTraerMesas = false;
         }
      );
   }

   cargarMesa(mesa: any) {
      let ocupada = false;

      this.mesas.forEach(mesita => {
         if (
            mesita.codigo_mesa === mesa.codigo_mesa &&
            mesa.id_cliente != null
         ) {
            this._toastr.error(
               "La mesa está ocupada por el cliente " +
                  mesa.nombre +
                  " " +
                  mesa.apellido,
               "",
               {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               }
            );
            ocupada = true;
            return;
         }
      });

      if (ocupada === false) {
         this.mesaElegida = mesa;
      }
   }

   cargarPedido() {
      let pedidoAEnviar: PedidoAEnviar = new PedidoAEnviar();

      pedidoAEnviar.id_mesa = this.mesaAsignada.mesa_id;

      if (this.itemsPedido.length > 0) {
         this.spinnerTraerMesasCliente = true;

         let dataUser = this._authenticationService.getUserDataToken();

         pedidoAEnviar.id_cliente = dataUser.id;

         this.itemsPedido.forEach((element: ArrayItem) => {
            pedidoAEnviar.arrayItems.push({
               nombre: element.nombre,
               cantidad: element.cantidad
            });
         });

         this._servicioComandaService.cargarPedido(pedidoAEnviar).subscribe(
            (resultado: any) => {
               this.spinnerTraerMesasCliente = false;
               this._toastr.success(resultado.mensaje, "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });
            },
            error => {
               this.spinnerTraerMesasCliente = false;
               this._toastr.error("Ha ocurrido un error.", "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });
            }
         );
      } else {
         this._toastr.error(
            "Debe seleccionar al menos un item para avanzar con el pedido.",
            "",
            {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            }
         );
      }
   }

   traerPedidosSector() {
      this.spinnerTraerPedidosSector = true;

      this._servicioComandaService
         .traerPedidosSector()
         .subscribe((resultado: any) => {
            if (resultado.pedidos) {
               resultado.pedidos.sort(function(a, b) {
                  if (a.id_comanda > b.id_comanda) {
                     return 1;
                  }
                  if (a.id_comanda < b.id_comanda) {
                     return -1;
                  }
                  // a must be equal to b
                  return 0;
               });
            }

            this.pedidosSector = resultado;
            this.spinnerTraerPedidosSector = false;
         });
   }

   marcharPedido(pedido: any) {
      this._servicioComandaService
         .marcharPedidoSector({ id_pedido_item: pedido.id })
         .subscribe((resultado: any) => {
            this._toastr.success(resultado.mensaje, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });

            this.traerPedidosSector();
         });
   }

   terminarPedido(pedido: any) {
      this._servicioComandaService
         .terminarPedidoSector({ id_pedido_item: pedido.id })
         .subscribe((resultado: any) => {
            this._toastr.success(resultado.mensaje, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });

            this.traerPedidosSector();
         });
   }

   traerPedidos() {
      this.spinnerTraerPedidos = true;
      this.subscriptionTraerPedidos = new Subscription();

      if (this.dataUserForHome.perfil == "Mozo") {
         this.subscriptionTraerPedidos.add(
            interval(3000)
               .pipe(startWith(0))
               .subscribe(() => {
                  this._servicioComandaService.traerTodosLosPedidos().subscribe(
                     resultado => {
                        this.pedidos = resultado;
                        this.pedidosFiltrados = this.pedidos;
                        if (this.filtroDeseado != " ") {
                           this.pedidosFiltrados = this.pedidos.filter(
                              pedido => pedido.estado === this.filtroDeseado
                           );
                        }
                        this.spinnerTraerPedidos = false;
                     },
                     error => {},
                     () => {
                        this.spinnerTraerPedidos = false;
                     }
                  );
               })
         );
      } else if (this.dataUserForHome.perfil == "Admin") {
         this.subscriptionTraerPedidos.add(
            interval(3000)
               .pipe(startWith(0))
               .subscribe(() => {
                  this._servicioComandaService
                     .traerTodosLosPedidosAdmin()
                     .subscribe(
                        resultado => {
                           this.pedidos = resultado;
                           this.pedidosFiltrados = this.pedidos;
                           if (this.filtroDeseado != " ") {
                              this.pedidosFiltrados = this.pedidos.filter(
                                 pedido => pedido.estado === this.filtroDeseado
                              );
                           }
                           this.spinnerTraerPedidos = false;
                        },
                        error => {},
                        () => {
                           this.spinnerTraerPedidos = false;
                        }
                     );
               })
         );
      }
   }

   finalizarTraerPedidos() {
      this.subscriptionTraerPedidos.unsubscribe();
   }

   copiarObjetito(element) {
      this.expandedElement = JSON.parse(JSON.stringify(element));
      this.expandedElementEdit = JSON.parse(JSON.stringify(element));
   }

   filtrar(elemento: any) {
      this.filtroDeseado = elemento.value;

      if (elemento.value != " ") {
         this.pedidosFiltrados = this.pedidos.filter(
            pedido => pedido.estado === elemento.value
         );
      } else {
         this.pedidosFiltrados = this.pedidos;
      }
   }

   traerClientes() {
      this.spinnerTraerClientes = true;
      this._servicioComandaService.traerClientes().subscribe(
         resultado => {
            this.clientes = resultado;
            this.spinnerTraerClientes = false;
         },
         error => {
            this.spinnerTraerClientes = false;
         }
      );
   }

   cargarCliente(cliente: any) {
      this.clienteElegidoMesa = cliente;
   }

   AsignarMesa() {
      // this.submitted2 = true;

      // stop here if form is invalid
      // if (this.registerForm.invalid) {
      //    return;
      // }

      if (this.mesaElegida == null) {
         this._toastr.error("Debe elegir una mesa.", "", {
            timeOut: 3000,
            positionClass: "toast-bottom-center"
         });
         return;
      }
      if (this.clienteElegidoMesa == null) {
         this._toastr.error("Debe elegir un cliente.", "", {
            timeOut: 3000,
            positionClass: "toast-bottom-center"
         });
         return;
      }

      this.spinnerAsignTable = true;

      var formData: any = new FormData();
      formData.append("id_mesa", this.mesaElegida.mesa_id);
      formData.append("id_cliente", this.clienteElegidoMesa.id);

      this._servicioComandaService.asignarMesa(formData).subscribe(
         (resultado: any) => {
            this._toastr.success(resultado.mensaje, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });
            this.spinnerAsignTable = false;
            this.traerMesas();
            // this.profileForm.reset();
         },
         error => {
            this._toastr.error(error.error.error, "", {
               timeOut: 3000,
               positionClass: "toast-bottom-center"
            });
            this.spinnerAsignTable = false;
         }
      );
   }

   consultarAsignacion() {
      this.spinnerTraerMesasCliente = true;

      this._servicioComandaService.traerTodasLasMesas().subscribe(
         (resultado: any) => {
            this.spinnerTraerMesasCliente = false;
            let dataUser = this._authenticationService.getUserDataToken();
            resultado.forEach(mesa => {
               if (mesa.id_cliente != null && mesa.id_cliente == dataUser.id) {
                  this.mesaAsignada = mesa;
                  return;
               }
               if (!this.mesaAsignada) {
                  this.mesaAsignada = 1;
               }
            });
         },
         error => {
            this.spinnerTraerMesasCliente = false;
            this._toastr.error(
               "Error al intentar traer las mesas del cliente",
               "",
               {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               }
            );
         }
      );
   }

   traerPedidosCliente() {
      this.spinnerTraerPedidosCliente = true;
      this.subscriptionTraerPedidos = new Subscription();

      this.subscriptionTraerPedidos.add(
         interval(3000)
            .pipe(startWith(0))
            .subscribe(() => {
               this._servicioComandaService.traerPedidosCliente().subscribe(
                  resultado => {
                     this.pedidosCliente = resultado;
                     this.spinnerTraerPedidosCliente = false;
                  },
                  error => {},
                  () => {
                     this.spinnerTraerPedidosCliente = false;
                  }
               );
            })
      );
   }

   finalizarTraerPedidosCliente() {
      this.subscriptionTraerPedidos.unsubscribe();
   }

   traerReportes(endpoint: string) {
      this.spinnerTraerReportes = true;
      this._servicioComandaService.traerReportes(endpoint).subscribe(
         (resultado: any) => {
            this.reportes = resultado.resultado;
            this.spinnerTraerReportes = false;
         },
         error => {
            this.spinnerTraerReportes = false;
         }
      );
   }

   exportexcel(nombre: string, id: string): void {
      /*name of the excel-file which will be downloaded. */
      let fileName = nombre + ".xlsx";

      /* table id is passed over here */

      let element = document.getElementById(id);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, fileName);
   }

   actualizarMesa(estadoMesa: string, id_mesa: number) {
      this.spinnerTraerMesas = true;
      this._servicioComandaService
         .actualizarEstadoMesa({ estado: estadoMesa, mesa_id: id_mesa })
         .subscribe(
            (resultado: any) => {
               this._toastr.success(resultado.mensaje, "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });

               this.traerMesas();
            },
            error => {
               this._toastr.error("Ha ocurrido un error", "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });
               this.spinnerTraerMesas = false;
            }
         );
   }

   cerrarMesa(estadoMesa: string, id_mesa: number) {
      this.spinnerTraerMesas = true;
      this._servicioComandaService
         .cerrarMesa({ estado: estadoMesa, mesa_id: id_mesa })
         .subscribe(
            (resultado: any) => {
               this._toastr.success(resultado.mensaje, "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });

               this.traerMesas();
            },
            error => {
               this._toastr.error("Ha ocurrido un error", "", {
                  timeOut: 3000,
                  positionClass: "toast-bottom-center"
               });
               this.spinnerTraerMesas = false;
            }
         );
   }

   enterCard(value: any) {
      if (document.getElementById(value))
         document.getElementById(value).style.display = "block";
   }

   leaveCard(value: any) {
      if (document.getElementById(value))
         document.getElementById(value).style.display = "none";
   }

   prepararDatosPdf(pedido: any) {
      let body = {
         body: [["Producto", "Cantidad", "Precio", "Subtotal"]]
      };

      let total: number = 0;

      pedido.pedidoItems.forEach(itemPedido => {
         let linea = [
            itemPedido.nombre.toString(),
            itemPedido.cantidad.toString(),
            "$" + itemPedido.precio.toString(),
            "$" + (itemPedido.cantidad * itemPedido.precio).toString()
         ];
         body.body.push(linea);

         total += itemPedido.cantidad * itemPedido.precio;
      });

      body.body.push(["", "", "TOTAL", "$" + total.toString()]);

      return body;
   }

   generatePdf(pedido: any) {
      var bodyNice = this.prepararDatosPdf(pedido);

      var comanda = pedido.id_comanda;

      var dd = {
         content: [
            {
               image:
                  "data:image/png;base64,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",
               width: 150,
               alignment: "center"
            },
            {
               text:
                  "\n\nEstimado cliente, a continuación se detalla su pedido: " +
                  comanda.toString() +
                  "\n\n",
               style: "header",
               alignment: "center"
            },
            {
               style: "tableExample",
               table: {
                  body: bodyNice.body
               }
            },
            {
               text:
                  "\n\n Esperamos que haya tenido una agradable estadía.\nLo esperamos pronto!\n\n",
               style: "header",
               alignment: "center"
            }
         ],
         styles: {
            header: {
               fontSize: 18,
               bold: true
            },
            subheader: {
               fontSize: 15,
               bold: true
            },
            quote: {
               italics: true
            },
            small: {
               fontSize: 8
            },
            tableExample: {
               margin: [90, 5, 0, 15]
            }
         }
      };
      pdfMake.createPdf(dd).download();
   }

   traerEncuestas() {
      this.spinnerTraerEncuestas = true;
      this._servicioComandaService.traerEncuestas().subscribe(
         (resultado: any) => {
            this.encuestas = resultado.resultado;
            this.spinnerTraerEncuestas = false;
         },
         error => {
            this.spinnerTraerEncuestas = false;
         }
      );
   }
}

export class PedidoAEnviar {
   id_mesa: number;
   arrayItems: ArrayItem[];
   id_cliente: number;

   constructor() {
      this.arrayItems = [];
   }
}

export class ArrayItem {
   nombre: string;
   cantidad: number;
}
