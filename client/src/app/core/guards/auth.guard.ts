import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountSrv: AccountService , private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean > {
    return this.accountSrv.currentUser$.pipe(
      map(auth => {
          if (auth) {
            return true;
          }
          this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}});

      })
    );
  }
}
