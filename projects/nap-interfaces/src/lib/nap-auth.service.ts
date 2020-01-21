import { Injectable } from '@angular/core';
import { NAPConnectionService } from './nap-connection.service';
import { NapResponse, NapResourcesAllowedI, NAPLoginOptions, NAPLoginIdentities, NAPResetPasswordOptions } from './napi.interfaces';
import { Subject } from 'rxjs';


@Injectable()
export class NAPAuthService {
    
    private authUser: any = {};
    /**
     * Inscrição de eventos quando houver mudança de usuário
     */
    public userChanged: Subject<void> = new Subject();

    /**
     * Variavel se usuario está autenticado ou nao
     */
    set authenticated(auth: boolean) {this.conn.authenticated = auth;}
    get authenticated(): boolean {return this.conn.authenticated;}


    private _resourcesAllowed: NapResourcesAllowedI = {};
    /**
     * Informa quais recursos o usuário tem permissão de acesso ou não
     */
    set resourcesAllowed(resAllw: NapResourcesAllowedI) {
        if (resAllw === this._resourcesAllowed) return;
        this._resourcesAllowed = resAllw;
        this.resourcesAllowedChange.next(this._resourcesAllowed);
    }
    get resourcesAllowed(): NapResourcesAllowedI {
        return this._resourcesAllowed;
    }
    /**
     * Evento as mudanças de resourcesAllowed
     */
    resourcesAllowedChange: Subject<NapResourcesAllowedI> = new Subject();

    /**
     * Informar qual engine de sessão o back deve tratar as requisiçoes
     */
    sessionEngine: string;

    
    constructor(public conn: NAPConnectionService) {}

    /**
     * Verificar se usuário está authenticado
     */
    checkAuthenticated(): Promise<boolean> {
        return new Promise((resolve) => {
            this.read().then(() => {
                if (this.authenticated) resolve(true);
                else resolve(false);
            });
        });
    }

    /**
     * Capturar usuario
     */
    getUser() {
        if (!this.authenticated) return {};
        if (this.authUser.email) return this.authUser;
    }

    /**
     * Setar Usuário
     * @param data Dados de usuario
     */
    setUser(data: object) {
        Object.assign(this.authUser, data);
        this.userChanged.next();
    }

    ///////
    ///////  AUTH
    ///////
    /**
     * Fazer Login de usuário
     * @param data Dados para login
     * @param remember Marcação de aumentar tempo de autenticação
     * @param options Opçoes de login
     */
    login<T = any>(data: NAPLoginIdentities, remember?: boolean, options?: NAPLoginOptions): Promise<NapResponse<T>> {
        if (this.sessionEngine && !options) options = {sessionEngine: this.sessionEngine};
        if (this.sessionEngine && options && !options.sessionEngine) options.sessionEngine = this.sessionEngine;
        const requestBody = {operation: "login", remember: remember, options: options};
        Object.assign(requestBody, data);
        return this.conn.makeAuthRequest(requestBody);
    }
    
    /**
     * Fazer Logout
     * @param options Opçoes de logout
     */
    logout(options?: NAPLoginOptions) {
        const requestBody = {operation: "logout", options: options};
        return this.conn.makeAuthRequest(requestBody);
    }
    
    /**
     * Fazer Pedido de Recuperação de Senha por Email
     * @param email Email de usuário
     * @param options Opçoes de usuario
     */
    recoverPasswordByEmail(email: string, options?: NAPResetPasswordOptions): Promise<NapResponse<any>> {
        const requestBody = {operation: "recoverPasswordByEmail", email: email, originUrl: window.location.origin, options: options};
        return this.conn.makeAuthRequest(requestBody);
    }

    /**
     * @NotImplemented
     */
    recoverPasswordBySms(phone: string): Promise<NapResponse<any>> {
        const requestBody = {operation: "recoverPasswordBySms", phone: phone};
        return this.conn.makeAuthRequest(requestBody);
    }

    /**
     * Checagem de validação de token, se for válido pode mudar senha
     * @param token Token de recuperação de senha
     */
    checkToken(token: string): Promise<NapResponse<any>> {
        const requestBody = {operation: "checkToken", token: token};
        return this.conn.makeAuthRequest(requestBody);
    }

    /**
     * Reseta senha de usuario e pode fazer login
     * @param token Token de recuperação de senha
     * @param password Nova senha para usuário
     * @param options Opçoes de login
     */
    setPasswordForToken(token: string, password: string, options?: NAPLoginOptions): Promise<NapResponse<any>>  {
        const requestBody = {operation: "setPasswordForToken", token: token, password: password, options: options};
        return this.conn.makeAuthRequest(requestBody);
    }
    
    /**
     * Capturar dados de usuário
     */
    read<T = any>(): Promise<NapResponse<T>> {
        const requestBody = {operation: "read"};
        const prom = this.conn.makeAuthRequest(requestBody);
        prom.then((resp) => {
            if (resp.status == "success") {
                let userChanged = false;
                if (JSON.stringify(this.authUser) !== JSON.stringify(resp.data)) userChanged = true;
                this.authUser = resp.data;
                this.resourcesAllowed = resp.resourcesAllowed;
                if (userChanged) this.userChanged.next();
            }
        })
        return prom;
    }
    
}
