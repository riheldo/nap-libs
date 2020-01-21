export interface NapResponse<T> {
    status: "success" | "error";
    statusCode: number;
    data?: T;
    auth?: boolean;
    resourcesAllowed?: any;
}

/**
 * Documento de configuração para agrupamento de recurso
 * 
 * Exemplo:
 * {
 *    params: [
 *      ["COUNT", "id", "qtd"], 
 *      ["DATE_FORMAT", "_createdAt", "%Y-%m", "createdAt"]
 *    ], 
 *    group: ["createdAt"], 
 *    fields: ["id", "_createdAt"]
 *  }
 * Usando Filtro: ["id", ">", 200]
 * 
 * Será traduzido para:
 * "SELECT COUNT(`id`) as qtd, DATE_FORMAT(`_createdAt`, "%Y-%m") as createdAt FROM [...] WHERE (`id`>200) GROUP BY `createdAt`"
 */
export interface NapAggregation {
    /**
     * Parametros para agrupamento. Os parametros serão convertidos numa query SQL
     * O parametros recebe uma lista de array que tem a seguinte estrutura esperada:
     * Caso o array tenha um filho, espera-se que seja um campo do registro.
     * Caso tenha mais de um filho, o primeiro elemento do array será a função de agrupamento, o ultimo elemento será o alias e os elementos de 1 até n-1 serão parametros para a funcao de agrupamento. Se algum desses parametros forem fields, devera ser inserido no array de fields.
     * 
     * Exemplo: 
     * [["count", "id", "qtd"]]  ==(será convertido para)=>  COUNT(id) as qtd
     * Obs.: id precisa ser escrito no array de `fields` para informar ao servidor que id é um campo e não um parametro
     */
    params: Array<Array<string>>;
    /**
     * Array de campos do registro, informa ao servidor o que é campo de registro para poder diferenciar de parametros de função
     */
    fields: Array<string>;
    /**
     * Caso precise agrupar, agrupar por alias inserido no params
     */
    group?: Array<string>;
}


////
////// PERFIS DE REQUISICOES
////

export type NAPMiddleware = (o: any) => any;

export interface NAPMiddlewaresProfiles {
    [key: string]: Array<NAPMiddleware>;
}

////
/////// OPCOES PARA REQUISICAO
////

export interface NAPLoginOptions {
    sessionEngine?: string;
    avoidAuth?: boolean;
}
export interface NAPLoginIdentities {
    [key: string]: string | number;
}
export interface NAPResetPasswordOptions {
    destUrl?: string;
}

//// OPCOES DE OPERACOES
export interface NAPPayloadI {
    [key: string]: any;
}
export interface NAPGroupOption {
    selector: string;
    desc: string;
    isExpanded: boolean;
}
export interface NAPSortOption {
    selector: string;
    desc: boolean;
}
export interface NAPProjectionOption {
    [key: string]: any;
}

/**
 * Opções de requisição de Listagem
 */
export interface NAPListOptions {
    /**
     * Um documento de Chave=>Valor, serve para passar valores sem checagem no backend
     */
    payload?: NAPPayloadI;
    /**
     * @deprecated
     */
    group?: Array<NAPGroupOption>;
    /**
     * Configuração de Ordenação
     */
    sort?: Array<NAPSortOption>;
    /**
     * Quantidade de registros que será pulado.
     * Exemplo: 
     * {skip: 15}
     * Listar registros a partir do registro de numero 15
     */
    skip?: number;
    /**
     * Quantidade de registros que se deseja obter
     * Exemplo: 
     * {take: 3}
     * Listar 3 registros
     */
    take?: number;
    /**
     * @deprecated
     */
    projection?: NAPProjectionOption;
    /**
     * @deprecated
     */
    categories?: Array<string>;
}
export interface NAPReadOptions {
    /**
     * Um documento de Chave=>Valor, serve para passar valores sem checagem no backend
     */
    payload?: NAPPayloadI;
}
export interface NAPInsertOptions {
    /**
     * Um documento de Chave=>Valor, serve para passar valores sem checagem no backend
     */
    payload?: NAPPayloadI;
}
export interface NAPUpdateOptions {
    /**
     * Um documento de Chave=>Valor, serve para passar valores sem checagem no backend
     */
    payload?: NAPPayloadI;
    /**
     * @deprecated
     */
    unique?: boolean;
}
export interface NAPDeleteOptions {
    /**
     * Um documento de Chave=>Valor, serve para passar valores sem checagem no backend
     */
    payload?: NAPPayloadI;
}
export interface NAPAggregateOptions extends NAPListOptions {
}

////
////// RECURSOS PERMITIDOS
////

export interface NapResAllowedWriteI {
    name: string;
    type?: string;
    required?: boolean;
    default?: any;
    choices?: Array<string | number>;
    label?: string;
    description?: string;
}

export interface NapResAllowedReadI {
    name: string;
    type?: string;
    label?: string;
    description?: string;
}

export interface NapResOperationsAllowedI {
    read?: Array<string | NapResAllowedReadI>;
    insert?: Array<string | NapResAllowedWriteI>;
    update?: Array<string | NapResAllowedWriteI>;
    delete?: boolean;
}

export interface NapResourcesAllowedI {
    [key: string]: NapResOperationsAllowedI;
}


// 
//
export type NAPFunctionFilter = () => Array<any>;