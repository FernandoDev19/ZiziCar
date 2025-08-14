import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { DataCommonService } from '../../../common/services/data-common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private dataCommon: DataCommonService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.dataCommon.canActivate().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
          return of(false);
        }

        // Si está autenticado, carga el perfil del usuario
        return this.dataCommon.loadUserProfile().pipe(
          map(() => {
            const requiredRole = route.data['role'];
            const userRole = this.dataCommon.userRole;

            // Verificación del rol
            if (requiredRole) {
              if (Array.isArray(requiredRole) && !requiredRole.includes(userRole)) {
                this.router.navigate(['/home']);
                return false;
              }
              if (!Array.isArray(requiredRole) && userRole !== requiredRole) {
                this.router.navigate(['/home']);
                return false;
              }
            }
            return true;
          }),
          catchError(() => {
            this.router.navigate(['/auth/login']);
            return of(false);
          })
        );
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
