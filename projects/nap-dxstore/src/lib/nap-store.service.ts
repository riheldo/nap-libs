import { Injectable } from "@angular/core";
import { NAPDataStore } from "./nap-datastore";
import DataSource from "devextreme/data/data_source";
import { NAPConnectionService, NAPFunctionFilter } from "nap-interfaces";


/**
 * 
 */
@Injectable()
export class NAPStoreService {

    constructor(private conn: NAPConnectionService) {}
   
    /**
     * Pede o DataStore do DevExtreme com NapInterface
     * @param resource Nome do recurso
     * @param keys Chave Primaria do recurso
     * @param filter Filtro a ser usado para operar recurso
     */
    dataStore(resource: string, keys: Array<string> = ["_id"], filter?: Array<any> | NAPFunctionFilter): NAPDataStore {
        return new NAPDataStore(resource, this.conn, keys, filter);
    }

    /**
     * Pede o DataSource do DevExtreme com NapInterface
     * @param resource Nome do recurso
     * @param keys Chave Primaria do recurso
     * @param filter Filtro a ser usado para operar recurso
     */
    dataSource(resource: string, keys: Array<string> = ["_id"], filter?: Array<any> | NAPFunctionFilter): DataSource {
        return new DataSource(this.dataStore(resource, keys, filter));
    }
}