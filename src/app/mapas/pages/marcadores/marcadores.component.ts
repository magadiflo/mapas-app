import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string,
  marcador?: mapboxgl.Marker,
  centro?: [number, number],
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `.mapa-container {
      width: 100%;
      height: 100%;
    }
    
    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    
    li {
      cursor: pointer;
    }`
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 16;
  center: [number, number] = [-78.52339270267693, -9.131787495382964];

  //Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });
    this.leerLocalStorage();
  }

  agregarMarcador(): void {
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({
      color,
      marcador: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador(marcador: mapboxgl.Marker): void {
    this.mapa.flyTo({
      center: marcador.getLngLat(),
    });
  }

  guardarMarcadoresLocalStorage(): void {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marcador!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat],
      })
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));


  }

  leerLocalStorage(): void {
    if(!localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      this.marcadores.push({
        color: m.color,
        marcador: newMarker,
      });

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
    });
    
  }

  borrarMarcador(i: number): void {
     this.marcadores[i].marcador?.remove();
     this.marcadores.splice(i, 1);
     this.guardarMarcadoresLocalStorage();
  }

}
