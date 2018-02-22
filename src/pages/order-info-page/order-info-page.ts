import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, NavParams, MenuController, ModalController, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { OrdersService } from '../../providers/orders-service';
import { UsersService } from '../../providers/users-service';
import { LocationServiceProvider } from '../../providers/location-service';
import { OrderModel } from '../../models/order.model';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

import leaflet from 'leaflet';
import 'leaflet-routing-machine';

@IonicPage()
@Component({
  selector: 'page-order-info-page',
  templateUrl: 'order-info-page.html',
})
export class OrderInfoPage extends ProtectedPage {
  map: any;
  marker: any;
  center: any;
  loading: any;
  driver: any;

  private order: OrderModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public platform: Platform,
    private launchNavigator: LaunchNavigator,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtr: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public authService: AuthService,
    public ordersService: OrdersService,
    public usersService: UsersService,
    public locationService: LocationServiceProvider,
    public configService: ConfigServiceProvider) {
    super(navCtrl, navParams, storage, authService);
    this.order = navParams.get('order');
  }

  ionViewWillEnter() {
    this.center = new leaflet.LatLng(this.order.latitud.replace(',', '.'), this.order.longitud.replace(',', '.'));
    this.loadmap();

    this.loading = this.loadingCtr.create({ content: "Cargando pedido..." });

    this.loading.present().then(() => {
      this.ordersService.getOne(this.order.id).then(updatedOrder => {
        //console.log(updatedOrder);
        this.order = updatedOrder;
        //console.log(updatedOrder);

        if (updatedOrder.datos.recogida.recogida_latitud && updatedOrder.datos.recogida.recogida_longitud && updatedOrder.datos.envio.envio_latitud && updatedOrder.datos.envio.envio_longitud){
          var newLatLng_recogida = new leaflet.LatLng(updatedOrder.datos.recogida.recogida_latitud.toString().replace(',', '.'), updatedOrder.datos.recogida.recogida_longitud.toString().replace(',', '.'));
          var newLatLng_envio = new leaflet.LatLng(updatedOrder.datos.envio.envio_latitud.toString().replace(',', '.'), updatedOrder.datos.envio.envio_longitud.toString().replace(',', '.'));

          this.RouteMap(newLatLng_recogida, newLatLng_envio);
        }

        if (updatedOrder.conductor_id != '0') {
          this.usersService.getOne(updatedOrder.conductor_id).then(driver => {
            this.driver = driver;
            this.loading.dismiss();
          });
        } else {
          this.loading.dismiss();
        }
      });
    });
  }

  loadmap() {
    this.map = leaflet.map("map", {
      center: this.center,
      zoom: 13
    });
    leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18
    }).addTo(this.map);

    this.marker = new leaflet.Marker(this.center);
    this.map.addLayer(this.marker);

    this.marker.bindPopup("<p>Pedido #" + this.order.id + "</p>");
  }

  updateMapMarkerPosition() {
    var newLatLng = new leaflet.LatLng(this.order.latitud.replace(',', '.'), this.order.longitud.replace(',', '.'));
    this.marker.setLatLng(newLatLng);
  }

  gotoExternalGps(destination){
    this.launchNavigator.navigate(destination)
      .then(
        success => console.log('Launched navigator'),
        error => alert('Error launching navigator: ' + JSON.stringify(error))
      );
  }

  RouteMap(origen, destino){
    // The example snippet is now working
    var control = leaflet.Routing.control({
       waypoints: [
         leaflet.latLng(origen),
         leaflet.latLng(destino)
       ],
      language: 'es',
      collapsible: true
     }).addTo(this.map);
    control.hide();
  }

  isOrderDriver(order: OrderModel) {
    let usr = this.authService.getUsr();

    if (usr.id == order.conductor_id) {
      return true;
    } else {
      return false;
    }
  }

  canDoActions(order: OrderModel) {
    if (this.canPickupOrder(order) == true || this.canStoreOrder(order) == true || this.canCompleteOrder(order) == true || this.canAddDocumentOrder(order) == true) {
      return true;
    } else {
      return false;
    }
  }

  canPickupOrder(order: OrderModel) {
    let cfg = this.configService.remoteCfg;

    if (this.isOrderDriver(order) && order.tipo == 'estandar' && (order.estado == cfg.opciones.ext_shop.venta.estado_asociado || order.estado == cfg.opciones.ext_shop.venta.estado_en_espera)) {
      return true;
    } else {
      return false;
    }
  }

  canStoreOrder(order: OrderModel) {
    let cfg = this.configService.remoteCfg;

    if (this.isOrderDriver(order) && order.tipo == 'estandar' && order.estado == cfg.opciones.ext_shop.venta.estado_enviado) {
      return true;
    } else {
      return false;
    }
  }

  canCompleteOrder(order: OrderModel) {
    return this.canStoreOrder(order);
  }

  canAddDocumentOrder(order: OrderModel) {
    let cfg = this.configService.remoteCfg;

    if (this.isOrderDriver(order) && order.tipo == 'estandar' && (order.estado == cfg.opciones.ext_shop.venta.estado_enviado || order.estado == cfg.opciones.ext_shop.venta.estado_asociado || order.estado == cfg.opciones.ext_shop.venta.estado_en_espera)) {
      return true;
    } else {
      return false;
    }
  }

  viewNotes(order: OrderModel) {
    let modal = this.modalCtrl.create('OrderNotesPage', { order: this.order });
    modal.present();
  }

  openActions(order: OrderModel) {
    let buttons = [];
    if (this.isUserProvider() && this.order.proveedor_id == 0) {
      buttons.push({
        text: 'Asignar pedido',
        handler: () => {
          this.assignOrder(order);
        }
      });
    }

    if (this.canPickupOrder(order)) {
      buttons.push({
        text: 'Recoger pedido',
        handler: () => {
          this.pickupOrder(order);
        }
      });
    }

    if (this.canStoreOrder(order)) {
      buttons.push({
        text: 'Almacenar pedido',
        handler: () => {
          this.storeOrder(order);
        }
      });
    }

    if (this.canCompleteOrder(order)) {
      buttons.push({
        text: 'Finalizar pedido',
        handler: () => {
          this.completeOrder(order);
        }
      });
    }

    if (this.canAddDocumentOrder(order)) {
      buttons.push({
        text: 'Añadir documento',
        handler: () => {
          this.addDocumentOrder(order);
        }
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Acciones de pedido',
      buttons: buttons
    });
    actionSheet.present();
  }

  addDocumentOrder(order: OrderModel) {
    let modal = this.modalCtrl.create('OrderAddDocumentPage', { order: order });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && (data.text || data.documentUrl)) {
        this.loading = this.loadingCtr.create({ content: "Actualizando pedido..." });
        this.loading.present().then(() => {
          this.authService.getFormToken().then(newFormToken => {
            if (this.locationService.gps == 'on') {
              this.usersService.saveGeolocation(this.locationService.position.latitude, this.locationService.position.longitude).then(result_geo => {
                this.ordersService.addDocumentOrder(order, this.authService.getUsr(), data.text, data.documentUrl, newFormToken).then(result => {
                  if (result.response == 'error') {
                    let alert = this.alertCtrl.create({
                      title: 'Error',
                      subTitle: result.response_text,
                      buttons: ['OK']
                    });
                    this.loading.dismiss();
                    alert.present();
                  } else {
                    this.ordersService.getOne(order.id).then(updatedOrder => {
                      this.order = updatedOrder;
                      let toast = this.toastCtrl.create({
                        message: 'Nota añadida al pedido',
                        duration: 3000,
                        position: 'top'
                      });
                      toast.present();
                      this.loading.dismiss();
                      this.updateMapMarkerPosition();
                    });
                  }
                });
              });
            } else {
              this.ordersService.addDocumentOrder(order, this.authService.getUsr(), data.text, data.documentUrl, newFormToken).then(result => {
                if (result.response == 'error') {
                  let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: result.response_text,
                    buttons: ['OK']
                  });
                  this.loading.dismiss();
                  alert.present();
                } else {
                  this.ordersService.getOne(order.id).then(updatedOrder => {
                    this.order = updatedOrder;
                    let toast = this.toastCtrl.create({
                      message: 'Nota añadida al pedido',
                      duration: 3000,
                      position: 'top'
                    });
                    toast.present();
                    this.loading.dismiss();
                    this.updateMapMarkerPosition();
                  });
                }
              });
            }
          });
        });
      }
    });
  }

  pickupOrder(order: OrderModel) {
    let confirm = this.alertCtrl.create({
      title: '¿Seguro que quieres recoger el pedido?',
      message: 'Si aceptas, te comprometes a recoger el pedido al que se hace referencia en un plazo máximo de 15 minutos',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.usersService.saveGeolocation(this.locationService.position.latitude, this.locationService.position.longitude).then(result_geo => {
              this.pickupOrderProcess(order);
            });
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  storeOrder(order: OrderModel) {
    let confirm = this.alertCtrl.create({
      title: '¿Seguro que quieres almacenar el pedido?',
      message: 'Si aceptas, el pedido se almacenará en la posición en la que te encuentras actualmente',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.usersService.saveGeolocation(this.locationService.position.latitude, this.locationService.position.longitude).then(result_geo => {
              this.storeOrderProcess(order);
            });
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  completeOrder(order: OrderModel) {
    let confirm = this.alertCtrl.create({
      title: '¿Seguro que quieres finalizar el pedido?',
      message: 'Ya no podrás realizar ninguna acción más y el pedido pasará a estado completado',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.usersService.saveGeolocation(this.locationService.position.latitude, this.locationService.position.longitude).then(result_geo => {
              this.completeOrderProcess(order);
            });
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Cancelar clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  pickupOrderProcess(order: OrderModel) {
    this.loading = this.loadingCtr.create({ content: "Actualizando pedido..." });
    this.loading.present().then(() => {
      this.authService.getFormToken().then(newFormToken => {
        this.ordersService.pickupOrder(order, this.authService.getUsr(), newFormToken).then(result => {
          if (result.response == 'error') {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: result.response_text,
              buttons: ['OK']
            });
            this.loading.dismiss();
            alert.present();
          } else {
            this.ordersService.getOne(order.id).then(updatedOrder => {
              this.order = updatedOrder;
              let toast = this.toastCtrl.create({
                message: 'Pedido recogido correctamente',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.loading.dismiss();
              this.updateMapMarkerPosition();
            });
          }
        });
      });
    });
  }

  storeOrderProcess(order: OrderModel) {
    this.loading = this.loadingCtr.create({ content: "Actualizando pedido..." });
    this.loading.present().then(() => {
      this.authService.getFormToken().then(newFormToken => {
        this.ordersService.storeOrder(order, this.authService.getUsr(), newFormToken).then(result => {
          if (result.response == 'error') {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: result.response_text,
              buttons: ['OK']
            });
            this.loading.dismiss();
            alert.present();
          } else {
            this.ordersService.getOne(order.id).then(updatedOrder => {
              this.order = updatedOrder;
              let toast = this.toastCtrl.create({
                message: 'Pedido almacenado correctamente',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.loading.dismiss();
              this.updateMapMarkerPosition();
            });
          }
        });
      });
    });
  }

  completeOrderProcess(order: OrderModel) {
    this.loading = this.loadingCtr.create({ content: "Finalizando pedido..." });
    this.loading.present().then(() => {
      this.authService.getFormToken().then(newFormToken => {
        this.ordersService.completeOrder(order, this.authService.getUsr(), newFormToken).then(result => {
          if (result.response == 'error') {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: result.response_text,
              buttons: ['OK']
            });
            this.loading.dismiss();
            alert.present();
          } else {
            this.ordersService.getOne(order.id).then(updatedOrder => {
              this.order = updatedOrder;
              let toast = this.toastCtrl.create({
                message: 'Pedido finalizado',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.loading.dismiss();
              this.updateMapMarkerPosition();
            });
          }
        });
      });
    });
  }

  assignOrder(order: OrderModel) {
    let modal = this.modalCtrl.create('DriversPage', { pageTitle: 'page.drivers' });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.driver) {
        this.loading = this.loadingCtr.create({ content: "Actualizando pedido..." });
        this.loading.present().then(() => {
          this.authService.getFormToken().then(newFormToken => {
            this.ordersService.assignOrder(order, data.driver, this.authService.getUsr(), newFormToken).then(result => {
              if (result.response == 'error') {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: result.response_text,
                  buttons: ['OK']
                });
                this.loading.dismiss();
                alert.present();
              } else {
                this.ordersService.getOne(order.id).then(updatedOrder => {
                  this.order = updatedOrder;
                  let toast = this.toastCtrl.create({
                    message: 'Pedido asignado correctamente',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.loading.dismiss();
                  this.updateMapMarkerPosition();
                });
              }
            });
          });
        });
      }
    });
  }
}
