import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `.mapa-container {
      width: 100%;
      height: 100%;
    }
    
    .row {
      background-color: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      width: 400px;
      z-index: 999;
    }`
  ]
})
export class ZoomRangeComponent implements AfterViewInit {
  /**
   * El view child sirve para tomar un elemento html y ussarlo como  una propiedad común y corriente.
   * 'mapa', es la referencia local que se estableció al div en el html. 
   * NOTA: Al trabajar con el ViewChild estaremos trabajando con las referencias locales. Estas referencias
   * locales permitirán trabajar con múltiples instancias de un componente, ya que si declaramos un componente
   * con un id="mapa", por ejemplo, este chocaría si creamos más instancias ya que también tendrían
   * el id="mapa". 
   * Al trabajar con ViewChild y las referencias locales, ANGULAR le agregará un id único por nosotros
   */
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;

  constructor() { }

  ngAfterViewInit(): void {  
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-78.52339270267693, -9.131787495382964],
      zoom: this.zoomLevel,
    });
    
    this.mapa.on('zoom', () => {
      this.zoomLevel = this.mapa.getZoom();  
    });

    this.mapa.on('zoomend', () => {
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }
    });
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));  
  }

}
