export class OrderModel {
 
  public id?: number;
  public usuario_id?: number;
  public proveedor_id?: number;
  public conductor_id?: number;
  public estado?: string;
  public fecha: string;
  public tipo: string;
  public cliente: string;
  public tarifa: string;
  public peso: string;
  public distancia: string;
  public recogida: string;
  public entrega: string;
  public latitud: string;
  public longitud: string;
  public datos: OrderDataModel;
	
}

export class OrderDataModel {
    public notas: Array<{ nota: string, fecha: any, tipo: any, latitud: any, longitud: any, adjunto: any }>;
}
