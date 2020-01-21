import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Subscription } from 'rxjs';
import { NAPAuthService } from './nap-auth.service';
import { NAPConnectionService } from './nap-connection.service';

@Injectable()
export class AuthGuard implements CanActivate, CanDeactivate<void> {

    static loginPath: string = "/login";

    sub: Subscription;
    inPrivateMode: boolean;

    constructor(private router: Router, private authConn: NAPAuthService, private conn: NAPConnectionService) {
    }

    redirectToLogin(loginPath?: string) {
        if (!loginPath) loginPath = AuthGuard.loginPath;
        const next: string = window.location.href.replace(window.location.origin, "");
        let params;
        if (next) params = {queryParams: {_next: next}};
        this.router.navigateByUrl(loginPath, params);
    }

    redirectFromLogin(path: string = "/") {
        // this.route.queryParams
        this.router.navigateByUrl("/");
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        this.inPrivateMode = true;
        return this.authConn.checkAuthenticated().then((val) => {
            if (!val) this.redirectToLogin();
            else this.sub = this.conn.authenticatedChange.subscribe((val) => {
                if (!val) this.redirectToLogin();
                if (val && !this.inPrivateMode) this.redirectFromLogin();
            });
            this.inPrivateMode = val;
            return val;
        });

    }

    canDeactivate() {
        this.sub.unsubscribe();
        this.inPrivateMode = false;
        return true;
    }
}