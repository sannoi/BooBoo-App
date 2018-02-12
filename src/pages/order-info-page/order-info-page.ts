import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, ModalController, AlertController, ToastController, LoadingController} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {OrdersService} from '../../providers/orders-service';
import { OrderModel } from '../../models/order.model';
import leaflet from 'leaflet';

@IonicPage()
@Component({
  selector: 'page-order-info-page',
  templateUrl: 'order-info-page.html',
})
export class OrderInfoPage extends ProtectedPage {
    map: any;
    center: any;
	loading: any;

  private order: OrderModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
	public alertCtrl: AlertController,
	public toastCtrl: ToastController,
	public loadingCtr: LoadingController,
	public authService: AuthService,
    public ordersService: OrdersService) {

    super(navCtrl, navParams, storage, authService);
    
    this.order = navParams.get('order');

  }

  ionViewWillEnter() {
      this.center = new leaflet.LatLng(this.order.latitud.replace(',', '.'), this.order.longitud.replace(',', '.'));
      this.loadmap();
	  
	  this.loading = this.loadingCtr.create({content: "Cargando pedido..."});
	  
	  this.loading.present().then(() => {
		  this.ordersService.getOne(this.order.id).then(updatedOrder => {
			  //console.log(updatedOrder);
			  this.order = updatedOrder;
			  this.loading.dismiss();
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

      var marker = new leaflet.Marker(this.center);
      this.map.addLayer(marker);

      marker.bindPopup("<p>Pedido #" + this.order.id + "</p>");
	  
	  /*this.map.locate({
		setView: true,
		maxZoom: 10
	  }).on('locationfound', (e) => {
		console.log('found you');
	  });*/
  }
  
  isOrderDriver(order: OrderModel) {
	  let usr = this.authService.usr;
	  
	  if (usr.id == order.conductor_id) {
		  return true;
	  } else {
		  return false;
	  }
  }

  viewNotes(order: OrderModel) {
      let modal = this.modalCtrl.create('OrderNotesPage', {order: this.order});
      modal.present();
  }
  
  pickupOrder(order: OrderModel) {
	  
  }
  
  assignOrder(order: OrderModel) {
	  let modal = this.modalCtrl.create('DriversPage', {pageTitle: 'page.drivers'});
      modal.present();
	  
	  modal.onDidDismiss(data => {
		  if (data && data.driver){
			  this.loading = this.loadingCtr.create({content: "Actualizando pedido..."});
	  
			  this.loading.present().then(() => {
			  
				  this.ordersService.assignOrder(order, data.driver, this.authService.usr, this.authService.formToken).then(result => {
					if (result.response == 'error'){
						let alert = this.alertCtrl.create({
						  title: 'Error',
						  subTitle: result.response_text,
						  buttons: ['OK']
						});
						this.loading.dismiss();
						alert.present();
					} else {
						//order.proveedor_id = this.authService.usr.id;
						
						this.ordersService.getOne(order.id).then(updatedOrder => {
							this.order = updatedOrder;
							
							let toast = this.toastCtrl.create({
							  message: 'Pedido asignado correctamente',
							  duration: 3000
							});
							toast.present();
							
							this.loading.dismiss();
						});
					}
				  });
			  });
		  }
		  //console.log(data);
	   });
  }
  
  /*editBook(book: BookModel) {
    this.navCtrl.push('BookEditPage', {book: book});
  }
  
  deleteBook(book: BookModel) {
    this.booksService.remove(book.id)
      .then(() => this.navCtrl.pop())
      .catch(e => console.log("delete book error", e)); 
  }*/



}
