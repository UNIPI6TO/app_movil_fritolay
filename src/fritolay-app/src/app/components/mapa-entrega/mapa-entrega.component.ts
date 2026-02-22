import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-entrega',
  templateUrl: './mapa-entrega.component.html',
  styleUrls: ['./mapa-entrega.component.scss'],
  standalone: false
})
export class MapaEntregaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() latitud: number = 0;
  @Input() longitud: number = 0;
  @Output() ubicacionSeleccionada = new EventEmitter<{ lat: number; lng: number }>();

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private mapInitialized = false;
  private isUserInteraction = false; // Flag para evitar zoom reversal

  constructor() { }

  ngOnInit() {
    // Fix para el icono de Leaflet con Webpack
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit() {
    // Esperar a que el DOM esté completamente renderizado
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  private initMap() {
    // Verificar que el elemento existe y tiene altura
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento #map no encontrado');
      return;
    }

    // Usar ubicación proporcionada o default (San José, Costa Rica)
    const lat = this.latitud || 9.9281;
    const lng = this.longitud || -84.0907;

    try {
      // Crear el mapa
      this.map = L.map('map', {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true
      });

      // Agregar capa de OpenStreetMap
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 10,
        attribution: '© OpenStreetMap contributors',
        crossOrigin: true
      });

      tileLayer.addTo(this.map);

      // Cuando los tiles se carguen, actualizar el tamaño
      tileLayer.on('load', () => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });

      // Forzar actualización del tamaño del mapa múltiples veces
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 300);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 600);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 1000);

      // Agregar marcador arrastrable
      this.marker = L.marker([lat, lng], {
        draggable: true
      }).addTo(this.map);

      // Evento cuando el usuario arrastra el marcador
      this.marker.on('dragend', () => {
        if (this.marker) {
          this.isUserInteraction = true;
          const position = this.marker.getLatLng();
          this.ubicacionSeleccionada.emit({ lat: position.lat, lng: position.lng });
          
          // Resetear flag después de un breve delay
          setTimeout(() => {
            this.isUserInteraction = false;
          }, 100);
        }
      });

      // Evento cuando el usuario hace clic en el mapa
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        this.isUserInteraction = true;
        
        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        }
        
        this.ubicacionSeleccionada.emit({ lat, lng });
        
        // Resetear flag después de un breve delay
        setTimeout(() => {
          this.isUserInteraction = false;
        }, 100);
      });

      // Marcar como inicializado
      this.mapInitialized = true;
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si las coordenadas cambian después de que el mapa está inicializado
    if (this.mapInitialized && (changes['latitud'] || changes['longitud'])) {
      const lat = this.latitud || 9.9281;
      const lng = this.longitud || -84.0907;
      
      // Si el cambio viene de una interacción del usuario, solo actualizar el marcador
      // sin mover la vista (para evitar zoom reversal)
      if (this.isUserInteraction && this.marker) {
        this.marker.setLatLng([lat, lng]);
        return;
      }
      
      if (this.map && this.marker) {
        // Obtener el zoom actual para preservarlo
        const currentZoom = this.map.getZoom();
        
        // Actualizar vista manteniendo el zoom actual
        this.map.setView([lat, lng], currentZoom);
        this.marker.setLatLng([lat, lng]);
        
        // Forzar actualización del tamaño
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        }, 200);
      }
    }
  }

  ngOnDestroy() {
    // Limpiar el mapa al destruir el componente
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  // Método público para actualizar la ubicación desde el componente padre
  public actualizarUbicacion(lat: number, lng: number) {
    if (this.map && this.marker) {
      // Obtener el zoom actual para preservarlo
      const currentZoom = this.map.getZoom();
      
      // Actualizar vista manteniendo el zoom actual
      this.map.setView([lat, lng], currentZoom);
      this.marker.setLatLng([lat, lng]);
      
      // Forzar redibujado
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    }
  }
}
