import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { LocationServiceProvider } from '../../providers/location-service';
import * as leaflet from 'leaflet';
import 'leaflet-realtime';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';
import 'leaflet.markercluster';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';
import {OrdersService} from '../../providers/orders-service';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage extends ProtectedPage {
  map: any;
  marker: any;
  center: any;
  realtime: any;
  gps: any;
  filter_status: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public authService: AuthService,
    public configService: ConfigServiceProvider,
    public ordersService: OrdersService,
    public locationService: LocationServiceProvider) {
    super(navCtrl, navParams, storage, authService);
  }

  ionViewDidLoad() {
    this.center = new leaflet.LatLng(40.5, -3.2);
    this.loadmap();
  }

  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";

    if (this.realtime) {
      this.realtime.stop();
    }
  }

  filtro() {
    if (this.filter_status && this.filter_status != 0) {
      if (this.filter_status == 1) {
        return "Sin Asignar";
      } else if (this.filter_status == 5) {
        return "En Ruta";
      } else if (this.filter_status == 6) {
        return "Esperando Recogida";
      } else if (this.filter_status == 7) {
        return "Almacenado";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  filterByStatus(status: any) {
    this.filter_status = status;
    if (!status || status == 0) {
      this.realtime.setUrl(this.configService.apiUrl() + '/shop/pedido/realtimePedidos.json/?solo_usuario_actual=1&solo_disponibles=0&usuario_id=' + this.authService.getUsr().id);
    } else {
      this.realtime.setUrl(this.configService.apiUrl() + '/shop/pedido/realtimePedidos.json/?solo_usuario_actual=1&solo_disponibles=0&usuario_id=' + this.authService.getUsr().id + '&filtro_estado=' + status);
    }
  }

  orderInfo(feature: any) {
    if (feature && feature.properties && feature.properties.id) {
      this.ordersService.getOne(parseInt(feature.properties.id)).then(res => {
        this.map.setView(new leaflet.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
        let modal = this.modalCtrl.create('OrderInfoPage', { order: res, esModal: true });
        modal.present();
      });

    }
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

    var loc = this.locationService;
    var clusterGroup = leaflet.markerClusterGroup().addTo(this.map);

    if (!this.realtime) {
      var este = this;
      this.realtime = leaflet.realtime({
        url: this.configService.apiUrl() + '/shop/pedido/realtimePedidos.json/?solo_usuario_actual=1&solo_disponibles=0&usuario_id=' + this.authService.getUsr().id,
        crossOrigin: true,
        type: 'json'
      }, {
          interval: 15 * 1000,
          container: clusterGroup,
          onEachFeature: function(feature, layer) {
            layer.on('click', function(e) {
              este.orderInfo(feature);
            });
            var _content = feature['properties'].content;
            layer.bindPopup(_content);
          },
          pointToLayer: function (feature, latlng) {
            console.log(feature);
            if (feature.properties.estado_id == "5") {
              var blueMarker = leaflet.AwesomeMarkers.icon({
                icon: 'truck',
                prefix: 'fa',
                markerColor: 'blue'
              });
              return leaflet.marker(latlng, {icon: blueMarker});
            } else if (feature.properties.estado_id == "7") {
              var orangeMarker = leaflet.AwesomeMarkers.icon({
                icon: 'home',
                prefix: 'fa',
                markerColor: 'orange'
              });
              return leaflet.marker(latlng, {icon: orangeMarker});
            } else if (feature.properties.estado_id == "6") {
              var greenMarker = leaflet.AwesomeMarkers.icon({
                icon: 'pause',
                prefix: 'fa',
                markerColor: 'green'
              });
              return leaflet.marker(latlng, {icon: greenMarker});
            } else if (feature.properties.estado_id == "1") {
              var redMarker = leaflet.AwesomeMarkers.icon({
                icon: 'exclamation-circle',
                prefix: 'fa',
                markerColor: 'red'
              });
              return leaflet.marker(latlng, {icon: redMarker});
            }
          }
        }).addTo(this.map);

      var map1 = this.map;
      var rt = this.realtime;
      var geo_ext_opt = this.configService.cfg.extensions.geolocation.active;

      this.realtime.on('update', function(data) {
        var featuresArr = Object.keys(data.features).map(function(k) {
          return data.features[k]
        });
        if (geo_ext_opt) {
          let result = loc.GPSStatus();
          if (result == true) {
            console.log("Realtime geolocation true");
          } else if (featuresArr && featuresArr.length > 0) {
            map1.fitBounds(rt.getBounds());
          }
        } else {
          map1.fitBounds(rt.getBounds());
        }
      });
    } else {
      this.realtime.start();
    }

    if (this.configService.cfg.extensions.geolocation.active) {
      let result = loc.GPSStatus();
      this.gps = result;
      if (result == true) {
        var redIcon = leaflet.icon({
          iconUrl: 'assets/img/marker-icon2.png',
          iconSize: [16, 16],
          iconAnchor: [8, 0],
          popupAnchor: [0, 0]
        });

        this.marker = new leaflet.Marker(this.center, { icon: redIcon });
        this.map.addLayer(this.marker);

        this.marker.bindPopup("<p>Tu localización</p>");

        if (this.locationService.position && this.locationService.position.latitude) {
          this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude), 15);
          this.marker.setLatLng(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
        }

        this.locationService.geolocation.watchPosition()
          .subscribe(position => {
            //this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
            this.marker.setLatLng(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
            console.log("View setted: " + this.locationService.position);
          });
      }
    }
  }

  centerMapUserLocation() {
    this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
  }
}
