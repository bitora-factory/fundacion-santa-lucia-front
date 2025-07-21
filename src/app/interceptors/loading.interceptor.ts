import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
// import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService: LoadingService = inject(LoadingService);
  const alertService: AlertService = inject(AlertService);

  // Mostrar pantalla de carga
  loadingService.show();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejar errores
      handleError(error, alertService);
      return throwError(() => error);
    }),
    finalize(() => {
      // Ocultar pantalla de carga al finalizar
      loadingService.hide();
    })
  );
};

function handleError(error: HttpErrorResponse, alertService: AlertService): void {
  let errorMessage = 'Ha ocurrido un error inesperado';

  if (error.error instanceof ErrorEvent) {
    // Error del lado del cliente
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Error del lado del servidor
    switch (error.status) {
      case 400:
        errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
        break;
      case 401:
        errorMessage = 'No autorizado. Debe iniciar sesión.';
        break;
      case 403:
        errorMessage = 'Acceso prohibido. No tiene permisos para esta acción.';
        break;
      case 404:
        errorMessage = 'Recurso no encontrado.';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Intente más tarde.';
        break;
      case 0:
        errorMessage = 'No se puede conectar al servidor. Verifique su conexión.';
        break;
      default:
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
    }
  }

  // Mostrar mensaje de error
  alertService.showError(errorMessage);
}
