import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loadingInterceptor } from './interceptors/loading.interceptor';

// Traducciones en español para PrimeNG
const primeNgSpanishConfig = {
  startsWith: 'Empieza con',
  contains: 'Contiene',
  notContains: 'No contiene',
  endsWith: 'Termina con',
  equals: 'Igual a',
  notEquals: 'No igual a',
  noFilter: 'Sin filtro',
  filter: 'Filtrar',
  lt: 'Menor que',
  lte: 'Menor o igual que',
  gt: 'Mayor que',
  gte: 'Mayor o igual que',
  dateIs: 'Es igual a',
  dateIsNot: 'No es igual a',
  dateBefore: 'Es anterior a',
  dateAfter: 'Es posterior a',
  clear: 'Limpiar',
  apply: 'Aplicar',
  matchAll: 'Coincidir con todos',
  matchAny: 'Coincidir con alguno',
  addRule: 'Agregar regla',
  removeRule: 'Remover regla',
  accept: 'Aceptar',
  reject: 'Cancelar',
  choose: 'Elegir',
  upload: 'Subir',
  cancel: 'Cancelar',
  completed: 'Completado',
  pending: 'Pendiente',
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  chooseYear: 'Elegir año',
  chooseMonth: 'Elegir mes',
  chooseDate: 'Elegir fecha',
  prevDecade: 'Década anterior',
  nextDecade: 'Siguiente década',
  prevYear: 'Año anterior',
  nextYear: 'Siguiente año',
  prevMonth: 'Mes anterior',
  nextMonth: 'Siguiente mes',
  prevHour: 'Hora anterior',
  nextHour: 'Siguiente hora',
  prevMinute: 'Minuto anterior',
  nextMinute: 'Siguiente minuto',
  prevSecond: 'Segundo anterior',
  nextSecond: 'Siguiente segundo',
  am: 'am',
  pm: 'pm',
  today: 'Hoy',
  weekHeader: 'Sm',
  firstDayOfWeek: 1,
  dateFormat: 'dd/mm/yy',
  weak: 'Débil',
  medium: 'Medio',
  strong: 'Fuerte',
  passwordPrompt: 'Ingrese una contraseña',
  emptyFilterMessage: 'No se encontraron resultados',
  searchMessage: '{0} resultados disponibles',
  selectionMessage: '{0} elementos seleccionados',
  emptySelectionMessage: 'Ningún elemento seleccionado',
  emptySearchMessage: 'No se encontraron resultados',
  emptyMessage: 'No hay opciones disponibles'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({ 
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
      translation: primeNgSpanishConfig
    }),
    MessageService,
    {provide: LOCALE_ID, useValue: 'es-CO'},
    ConfirmationService
  ]
};
