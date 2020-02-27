import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
   providedIn: "root"
})
export class ServicioComandaService {
   constructor(private _httpClient: HttpClient) {}

   traerTodosLosItems() {
      return this._httpClient.get(environment.apiUrl + "/item/");
   }

   traerTodosLosItemsCliente() {
      return this._httpClient.get(environment.apiUrl + "/cliente/item");
   }

   guardarItem(Item: any) {
      return this._httpClient.post(environment.apiUrl + "/item/", Item);
   }

   modificarItem(Item: any) {
      return this._httpClient.post(environment.apiUrl + "/item/update", Item);
   }

   eliminarItem(idItem: any) {
      const url = `${environment.apiUrl + "/item"}/${idItem}`;

      return this._httpClient.delete(url);
   }

   traerTodasLasMesas() {
      return this._httpClient.get(environment.apiUrl + "/mesa/");
   }

   cargarPedido(pedido: any) {
      return this._httpClient.post(
         environment.apiUrl + "/cliente/pedido",
         pedido
      );
   }

   traerPedidosSector() {
      return this._httpClient.get(environment.apiUrl + "/pedidoitem/");
   }

   marcharPedidoSector(pedidoSector) {
      return this._httpClient.put(
         environment.apiUrl + "/pedidoitem/",
         pedidoSector
      );
   }

   terminarPedidoSector(pedidoSector) {
      return this._httpClient.put(
         environment.apiUrl + "/pedidoitem/terminar",
         pedidoSector
      );
   }

   traerTodosLosPedidos() {
      return this._httpClient.get(environment.apiUrl + "/pedido/");
   }

   traerTodosLosPedidosAdmin() {
      return this._httpClient.get(environment.apiUrl + "/empleado/pedidos/");
   }

   cargarCliente(Cliente: any) {
      return this._httpClient.post(
         environment.apiUrl + "/alta/cliente",
         Cliente
      );
   }

   traerClientes() {
      return this._httpClient.get(environment.apiUrl + "/pedido/clientes");
   }

   asignarMesa(asignacion: any) {
      return this._httpClient.post(
         environment.apiUrl + "/pedido/mesa",
         asignacion
      );
   }

   traerPedidosCliente() {
      return this._httpClient.get(environment.apiUrl + "/cliente/pedidos");
   }

   cargarEncuesta(Encuesta: any) {
      return this._httpClient.post(
         environment.apiUrl + "/cliente/encuesta",
         Encuesta
      );
   }

   traerReportes(endpoint: string) {
      return this._httpClient.get(environment.apiUrl + endpoint);
   }

   actualizarEstadoMesa(objetoRequest) {
      return this._httpClient.put(
         environment.apiUrl + "/mesa/update",
         objetoRequest
      );
   }

   cerrarMesa(objetoRequest) {
      return this._httpClient.put(
         environment.apiUrl + "/mesa/cerrar",
         objetoRequest
      );
   }

   traerEncuestas() {
      return this._httpClient.get(environment.apiUrl + "/encuestas/");
   }
}
