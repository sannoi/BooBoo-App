import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { LocationServiceProvider } from '../../providers/location-service';
import * as leaflet from 'leaflet';
import 'leaflet-realtime';
//import 'leaflet.locatecontrol';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage extends ProtectedPage {
  map: any;
  center: any;
  realtime: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public authService: AuthService,
    public locationService: LocationServiceProvider) {

    super(navCtrl, navParams, storage, authService);

    this.controlDef();
  }

  ionViewDidLoad() {
    this.center = new leaflet.LatLng(40.5, -3.2);
    this.loadmap();
  }

  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";
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

      this.realtime.on('update', function() {
        loc.GPSStatus().then(result => {
          if (result == true) {
            console.log("Realtime geolocation true");
          } else {
            //console.log(map1);
            map1.fitBounds(rt.getBounds());
          }
        });
      });
    }

    this.locationService.GPSStatus().then(result => {
      if (result == true) {
        var _control = function(opts) {
            return new leaflet.Control.CenterUser(opts);
        }

        _control({ position: 'bottomleft' }).addTo(this.map);

        var redIcon = leaflet.icon({
          iconUrl: 'assets/img/marker-icon2.png',
          shadowUrl: 'assets/img/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 40],
          popupAnchor: [0, -38]
        });

        var marker = new leaflet.Marker(this.center, { icon: redIcon });
        this.map.addLayer(marker);

        marker.bindPopup("<p>Tu localización</p>");

        if (this.locationService.position && this.locationService.position.latitude) {
          this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude), 15);
          marker.setLatLng(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
        }

        this.locationService.geolocation.watchPosition()
          .subscribe(position => {
            this.map.setView(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
            marker.setLatLng(new leaflet.LatLng(this.locationService.position.latitude, this.locationService.position.longitude));
            console.log("View setted: " + this.locationService.position);
          });
      }
    });
  }

  controlDef() {
    leaflet.Control.CenterUser = leaflet.Control.extend({
      onAdd: function(map) {
        var img = leaflet.DomUtil.create('img');

        img.src = '../../docs/images/logo.png';
        img.style.width = '200px';

        return img;
      },

      onRemove: function(map) {
        // Nothing to do here
      }
    });
  }
}
