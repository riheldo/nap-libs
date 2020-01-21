import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NapResponse, NapAggregation, NAPMiddleware, NAPMiddlewaresProfiles, NAPListOptions, NAPReadOptions, NAPInsertOptions, NAPUpdateOptions, NAPDeleteOptions, NAPAggregateOptions } from './napi.interfaces';

export enum NapMidExecLapse {
    onStart = "onStart",
    onEnd = "onEnd",
    always = "always"
}

export class NAPConnectionModel {
    
    constructor(private conn: NAPConnectionService, private connAuthorization: string) {}

    middlewaresBeforeConn: Array<NAPMiddleware> = [];
    middlewareAfterConn: Array<NAPMiddleware> = [];

    executionBefore(o) {
        let i = 0;
        for (const middleware of this.middlewaresBeforeConn) {
            o = middleware({data: o, lapse: NapMidExecLapse.onStart, round: i});
            i++;
        }
        return o;
    }
    executionAfter(o) {
        let i = 0;
        for (const middleware of this.middlewareAfterConn) {
            o = middleware({data: o, lapse: NapMidExecLapse.onEnd, round: i});
            i++;
        }
        return o;
    }

    /**
     * Faz uma requisição pedindo uma lista do recurso informado
     * @param resource Nome do recurso, definido no servidor
     * @param filter Filtro a ser aplicado na listagem dos registros
     * @param options Opções a ser aplicado 
     */
    list<T = any, R = NapResponse<Array<T>>>(resource: string, filter?: Array<any>, options?: NAPListOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "list", filter: filter, options: options, useAuth: this.connAuthorization};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    /**
     * @deprecated since version 2.0
     */
    read<T = any, R = NapResponse<Array<T>>>(resource: string, filter?: Array<any>, options?: NAPReadOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "read", filter: filter, options: options, useAuth: this.connAuthorization};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    /**
     * Faz uma inserção para recurso informado
     * @param resource Nome do recurso, definido no servidor
     * @param data Dados do registro que será inserido no recurso informado
     * @param options Opções de inserção
     */
    insert<T = any, R = NapResponse<T>>(resource: string, data: T, options?: NAPInsertOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "insert", data: data, useAuth: this.connAuthorization, options: options};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    /**
     * Requer uma atualização de um ou mais registros de um recurso
     * @param resource Nome do recurso, definido no servidor
     * @param data Dados do registro que será atualizado, tipo chave:valor, onde chave será o valor que será atualizado e o valor é o novo valor
     * @param filter Filto que será aplicado na atualização do registro, por segurança não será aceito update sem filtro.
     * @param options Opções de atualização
     */
    update<T = any, R = NapResponse<T>>(resource: string, data: T, filter: Array<any>, options?: NAPUpdateOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "update", data: data, filter: filter, useAuth: this.connAuthorization, options: options};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    /**
     * Faz uma exclusão de algum registro
     * @param resource Nome do recurso, definido no servidor
     * @param filter Filtro que é aplicado na exclusão de algum(s) registro, obrigatorio
     * @param options Opções de exclusão
     */
    delete<T = any, R = NapResponse<T>>(resource: string, filter: Array<any>, options?: NAPDeleteOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "delete", filter: filter, useAuth: this.connAuthorization, options: options};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    /**
     * Faz um pedido de agrupamento de algum recurso no servidor
     * @param resource do recurso, definido no servidor
     * @param aggregation Configuração de agrupamento `NapAggregation`
     * @param filter Filtro que é aplicado no agrupamento de recurso
     * @param options Opções de agrupamento
     */
    aggregate<T = any, R = NapResponse<T>>(resource: string, aggregation: NapAggregation, filter?: Array<any>, options?: NAPAggregateOptions): Promise<R> {
        let reqBody = {resource: resource, operation: "aggregate", aggregation: aggregation, filter: filter, useAuth: this.connAuthorization, options: options};
        reqBody = this.executionBefore(reqBody);
        return this.conn.makeResourceRequest(reqBody).then((resp) => {
            return this.executionAfter(resp)
        });
    }

    //
    //// MID OPERATIONS
    //

    /**
     * Cadastra o middleware para requisição
     * @param executionOf Middleware
     * @param midPosition Defini quando o middleware será executado. Default: always.
     */
    with(executionOf: string | NAPMiddleware | Array<NAPMiddleware>, midPosition: NapMidExecLapse = NapMidExecLapse.always): NAPConnectionModel {

        if (typeof executionOf === "string") {
            if (!this.conn.middlewaresBeforeProfile[executionOf] && !this.conn.middlewaresAfterProfile[executionOf]) {
                console.warn("Profile "+executionOf+" not found! Connection will procede ignoring this profile.");
                return this;
            }
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onStart) this.middlewaresBeforeConn = this.middlewaresBeforeConn.concat(this.conn.middlewaresBeforeProfile[executionOf] || []);
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onEnd) this.middlewareAfterConn = this.middlewareAfterConn.concat(this.conn.middlewaresAfterProfile[executionOf] || []);
            return this;
        }

        if (executionOf instanceof Array) {
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onStart) this.middlewaresBeforeConn = this.middlewaresBeforeConn.concat(executionOf);
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onEnd) this.middlewareAfterConn = this.middlewareAfterConn.concat(executionOf);
            return this;
        }
        
        if (typeof executionOf === "function") {
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onStart) this.middlewaresBeforeConn = this.middlewaresBeforeConn.concat([executionOf]);
            if (midPosition === NapMidExecLapse.always || midPosition === NapMidExecLapse.onEnd) this.middlewareAfterConn = this.middlewareAfterConn.concat([executionOf]);
            return this;
        }
        
        throw new Error("method '.with(..)': Invalid input");
    }

    /**
     * Informa a requisição qual autorização do usuario o server deve dar preferencia
     * @param authorization nome da authorizacao, cadastrado no server
     */
    useAuth(authorization: string): NAPConnectionModel {
        this.connAuthorization = authorization;
        return this;
    }
}

@Injectable()
export class NAPConnectionService {

    protected RURN: string = "/noapi/resources";
    protected AURN: string = "/noapi/auth";
    protected HOST: string = "";
    protected _AUTH_URL: string;
    protected _RESOURCE_URL: string;

    middlewaresBeforeProfile: NAPMiddlewaresProfiles = {};
    middlewaresAfterProfile: NAPMiddlewaresProfiles = {};
    defaultProfile: string = null;

    /**
     * Lista de ordem de permissões, para preferencia de recursos no server
     */
    xNapPermissionOrder: Array<string> = [];
    

    private _authenticated: boolean = false;
    set authenticated(auth: boolean) {
        if (auth === this._authenticated) return;
        this._authenticated = auth;
        this.authenticatedChange.next(this._authenticated);
    }
    get authenticated(): boolean {
        return this._authenticated;
    }
    authenticatedChange: Subject<boolean> = new Subject();

    defaultAuthorization: string;

    constructor(private http: HttpClient) {
        this.calcuteURLs();
    }


    /**
     * Cadastra middlewares de execução anteriores a requisição
     * @param profile Nome do perfil que será cadastrado
     * @param middlewares Lista de middlewares
     */
    createBeforeMiddlewareProfile(profile: string, middlewares: Array<NAPMiddleware>) {
        this.middlewaresBeforeProfile[profile] = middlewares;
    }
    /**
     * Cadastra lista de middlewares posteriores a requisição
     * @param profile Nome do perfil que será cadastrado
     * @param middlewares Lista de middlewares
     */
    createAfterMiddlewareProfile(profile: string, middlewares: Array<NAPMiddleware>) {
        this.middlewaresAfterProfile[profile] = middlewares;
    }
    /**
     * Perfil de middlewares para ser desintegrado
     * @param profile Nome do perfil
     */
    dropMiddlewareProfile(profile: string) {
        this.middlewaresBeforeProfile[profile] = null;
        this.middlewaresAfterProfile[profile] = null;
    }


    /**
     * Reliza a requisição
     * Retorno: Uma promise de NapResponse
     * @param URL informação para onde será feito a requisição
     * @param reqBody corpo da requisição
     */
    makeRequest(URL: string, reqBody: Array<any> | object): Promise<NapResponse<any>> {
        const responseObservable = this.http.post<NapResponse<any>>(URL, reqBody, {
            headers: {
                "x-nap-permission-order": this.xNapPermissionOrder.join(",")
            }
        });
        const prom = responseObservable.toPromise();
        prom.then((response) => {
            response.auth = !!response.auth;
            if (this.authenticated !== response.auth) {
                this.authenticated = response.auth;
            }
        });
        return prom;
    }

    private calcuteURLs() {
        this._AUTH_URL = this.HOST + this.AURN;
        this._RESOURCE_URL = this.HOST + this.RURN;
    }

    /**
     * Resource URN por padrão é "/noapi/resources", essa variável é concatenada em cada requisição feita para algum recurso no backend
     * @param path caminho para acesso de recurso
     */
    setResourceURN(path: string) {
        if (path[0] !== "/") path = "/" + path;
        this.RURN = path;
        this.calcuteURLs();
    }

    /**
     * Auth URN por padrão é "/noapi/auth", essa variável é responsável em requisições para chamadas de authenticação ou dados do usuário que está logado
     * @param path caminho para acesso ao auth
     */
    setAuthURN(path: string) {
        if (path[0] !== "/") path = "/" + path;
        this.AURN = path;
        this.calcuteURLs();
    }

    /**
     * Resposável por informar a classe qual o host que deve ser enviado as requisições, por padrão o host é "/", ou seja o mesmo no domínio onde o site está hospedado,
     * no entanto no app é necessário setar o host.
     * @param host endereço do host
     */
    setHost(host: string) {
        if (host[host.length-1] === "/") host = host.substr(0, host.length-1);
        this.HOST = host;
        this.calcuteURLs();
    }

    /**
     * Faz requisição para recurso, obtém o endereço da requisição internamente
     * @param reqBody Corpo da requisição
     */
    makeResourceRequest(reqBody: Array<any> | object) {
        return this.makeRequest(this._RESOURCE_URL, reqBody);
    }

    /**
     * Faz Requisição para auth, obtém o endereço da chamada internamente
     * @param reqBody Corpo da requisição
     */
    makeAuthRequest(reqBody: Array<any> | object) {
        return this.makeRequest(this._AUTH_URL, reqBody);
    }
    
    /**
     * Retorna uma instancia de `NAPConnectionModel` com middlewares pre definidos
     */
    getDefaultConnection(): NAPConnectionModel {
        const connInstance = new NAPConnectionModel(this, this.defaultAuthorization);
        connInstance.middlewaresBeforeConn = this.middlewaresBeforeProfile[this.defaultProfile] || [];
        connInstance.middlewareAfterConn = this.middlewaresAfterProfile[this.defaultProfile] || [];
        return connInstance;
    }

    ///////
    ///////  RESOURCES
    ///////

    /**
     * Faz uma requisição pedindo uma lista do recurso informado
     * @param resource Nome do recurso, definido no servidor
     * @param filter Filtro a ser aplicado na listagem dos registros
     * @param options Opções a ser aplicado 
     */
    list<T>(resource: string, filter?: Array<any>, options?: NAPListOptions): Promise<NapResponse<Array<T>>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.list<T>(resource, filter, options);
    }
    
    /**
     * @deprecated since version 2.0
     */
    read<T>(resource: string, filter?: Array<any>, options?: NAPReadOptions): Promise<NapResponse<Array<T>>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.read<T>(resource, filter, options);
    }

    /**
     * Faz uma inserção para recurso informado
     * @param resource Nome do recurso, definido no servidor
     * @param data Dados do registro que será inserido no recurso informado
     * @param options Opções de inserção
     */
    insert<T>(resource: string, data: T, options?: NAPInsertOptions): Promise<NapResponse<T>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.insert<T>(resource, data, options);
    }

    /**
     * Requer uma atualização de um ou mais registros de um recurso
     * @param resource Nome do recurso, definido no servidor
     * @param data Dados do registro que será atualizado, tipo chave:valor, onde chave será o valor que será atualizado e o valor é o novo valor
     * @param filter Filto que será aplicado na atualização do registro, por segurança não será aceito update sem filtro.
     * @param options Opções de atualização
     */
    update<T>(resource: string, data: T, filter: Array<any>, options?: NAPUpdateOptions): Promise<NapResponse<T>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.update<T>(resource, data, filter, options);
    }

    /**
     * Faz uma exclusão de algum registro
     * @param resource Nome do recurso, definido no servidor
     * @param filter Filtro que é aplicado na exclusão de algum(s) registro, obrigatorio
     * @param options Opções de exclusão
     */
    delete<T>(resource: string, filter: Array<any>, options?: NAPDeleteOptions): Promise<NapResponse<T>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.delete<T>(resource, filter, options);
    }

    /**
     * Faz um pedido de agrupamento de algum recurso no servidor
     * @param resource do recurso, definido no servidor
     * @param aggregation Configuração de agrupamento `NapAggregation`
     * @param filter Filtro que é aplicado no agrupamento de recurso
     * @param options Opções de agrupamento
     */
    aggregate<T>(resource: string, aggregation: NapAggregation, filter?: Array<any>, options?: NAPAggregateOptions): Promise<NapResponse<T>> {
        const connInstance = this.getDefaultConnection();
        return connInstance.aggregate<T>(resource, aggregation, filter, options);
    }

    /**
     * Cadastra o middleware para requisição
     * @param executionOf Middleware
     * @param midPosition Defini quando o middleware será executado. Default: always.
     */
    with(executionOf: string | NAPMiddleware | Array<NAPMiddleware>, midPosition: NapMidExecLapse = NapMidExecLapse.always) {
        const connInstance = this.getDefaultConnection();
        return connInstance.with(executionOf, midPosition);
    }
    
}
