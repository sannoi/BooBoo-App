import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { LocationServiceProvider } from '../../providers/location-service';
import * as leaflet from 'leaflet';
import 'leaflet-realtime';
import *  as AppConfig from '../../app/config';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage extends ProtectedPage {
  private cfg: any;
  map: any;
  marker: any;
  center: any;
  realtime: any;
  gps: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public authService: AuthService,
    public locationService: LocationServiceProvider) {
    super(navCtrl, navParams, storage, authService);
    this.cfg = AppConfig.cfg;
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

  loadmap() {
    this.map = leaflet.map("map", {
      center: this.center,
      zoom: 13
    });
    leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18
    }).addTo(this.map);

    if (!this.realtime) {
      this.realtime = leaflet.realtime({
        url: 'https://lastmile.mideas.es/api/shop/pedido/realtimePedidos.json/?solo_usuario_actual=1&solo_disponibles=0&usuario_id=1',
        crossOrigin: true,
        type: 'json'
      }, {
          interval: 15 * 1000,
          onEachFeature: function(feature, layer) {
            console.log(feature);
					  /*var content = '<h4>'+feature['properties'].id+'<\/h4>' +
					  '<p>Tipo: ' + feature['properties'].tipo + '<br \/>' +
					  'Estado: ' + feature['properties'].estado + '<\/p>';*/
            layer.bindPopup(feature['properties'].content);
          }
        }).addTo(this.map);

      var map1 = this.map;
      var rt = this.realtime;
      var loc = this.locationService;
      var geo_ext_opt = this.cfg.extensions_active.geolocation;

      this.realtime.on('update', function() {
        if (geo_ext_opt) {
          loc.GPSStatus().then(result => {
            if (result == true) {
              console.log("Realtime geolocation true");
            } else {
              //console.log(map1);
              map1.fitBounds(rt.getBounds());
            }
          });
        } else {
          map1.fitBounds(rt.getBounds());
        }
      });
    } else {
      this.realtime.start();
    }

    if (this.cfg.extensions_active.geolocation) {
      this.locationService.GPSStatus().then(result => {
        this.gps = result;
        if (result == true) {
          var redIcon = leaflet.icon({
            iconUrl: 'assets/img/marker-icon2.png',
            shadowUrl: 'assets/img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 40],
            popupAnchor: [0, -38]
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
      });
    }
  }

  centerMapUserLocation() {
    this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
  }
}
