import DevExpress from "devextreme/bundles/dx.all";
import CustomStore from "devextreme/data/custom_store";
import { Deferred } from 'jquery';
import { NAPConnectionService, NAPFunctionFilter } from "nap-interfaces";

/**
 * Documentação da classe no devextreme
 * Procure por `CustomStore`
 * 
 * A diferença é a implementação do filtro, o filtro é capturado em tempo de execução no momento em que é feito o pedido de listagem dos campos
 */
export class NAPDataStore extends CustomStore {

    constructor(
        protected resource: string, 
        protected conn: NAPConnectionService, 
        protected keysField: Array<string>, 
        public filter: Array<any> | NAPFunctionFilter
    ) {
        super();
    }

    /** Gets a data item with a specific key. */
    byKey(key: any | string | number): Promise<any> & JQueryPromise<any> {
        // used by outlook
        // console.log("byKey", key);
        const tempKeyValue = key;
        if (typeof tempKeyValue === "string") {
            key = {};
            key[this.keysField[0]] = tempKeyValue;
        }
        const dfd = Deferred();
        this.conn.list(this.resource, this.getKeyFilter(key)).then((resp) => {
            if (resp.status == "success") {
                dfd.resolve(resp.data[0]);
            } else {
                let errorMsg: string = resp.data["error"] + ": " + resp.data["errorMessage"];
                dfd.reject(errorMsg);
            }
        }).catch((reason) => {
            dfd.reject(reason);
        });
        return dfd.promise() as any;
    }
    /** Gets the total count of items the load() function returns. */
    totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number> {
        console.log("implement totalCount", obj);
        return super.totalCount(obj);
    }
    /** Gets the key property (or properties) as specified in the key option. */
    key(): any {
        return this.keysField;
    }
    /** Gets a data item's key value. */
    keyOf(obj: any): any {
        if (!obj) return {};
        const objKey = {};
        this.keysField.forEach((keyField) => {
            objKey[keyField] = obj[keyField];
        });
        return objKey;
    }
    /** Adds a data item to the store. */
    insert(values: any): Promise<any> & JQueryPromise<any> {
        // console.log("insert", values);
        const dfd = Deferred();
        delete values._id;
        this.conn.insert(this.resource, values).then((resp) => {
            if (resp.status == "success") {
                dfd.resolve(resp.data);
            } else {
                let errorMsg: string = resp.data["error"] + ": " + resp.data["errorMessage"];
                dfd.reject(errorMsg);
            }
        }).catch((reason) => {
            dfd.reject(reason);
        });
        return dfd.promise() as any;
    }

    getKeyFilter(key: any): Array<any> {
        if (key instanceof Array) return key;
        let filterKey: Array<any>;
        if (typeof key === "number" || typeof key === "string") {
            filterKey = [this.keysField[0], '=', key];
        } else if (typeof key === "object") {
            filterKey = [];
            for (const fieldKey in key) {
                filterKey.push([fieldKey, "=", key[fieldKey]], "AND");
            }
            filterKey.pop();
            if (filterKey.length === 1) filterKey = filterKey[0];
        }
        return filterKey;
    }

    /** Updates a data item with a specific key. */
    update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any> {
        // console.log("update", key, values);
        const dfd = Deferred();
        const filterKey = this.getKeyFilter(key);
        this.conn.update(this.resource, values, filterKey).then((resp) => {
            if (resp.status == "success") {
                dfd.resolve(resp.data);
            } else {
                let errorMsg: string = resp.data["error"] + ": " + resp.data["errorMessage"];
                dfd.reject(errorMsg);
            }
        }).catch((reason) => {
            dfd.reject(reason);
        });
        return dfd.promise() as any;
    }
    /** Removes a data item with a specific key from the store. */
    remove(key: any | string | number): Promise<void> & JQueryPromise<void> {
        const dfd = Deferred();
        const filterKey = this.getKeyFilter(key);
        this.conn.delete(this.resource, filterKey).then((resp) => {
            if (resp.status == "success") {
                dfd.resolve(resp.data);
            } else {
                let errorMsg: string = resp.data["error"] + ": " + resp.data["errorMessage"];
                dfd.reject(errorMsg);
            }
        }).catch((reason) => {
            dfd.reject(reason);
        });
        return dfd.promise() as any;
    }

    //load(): Promise<any> & JQueryPromise<any>; /** Starts loading data. */
    //load(options: DevExpress.data.LoadOptions): Promise<any> & JQueryPromise<any>; /** Starts loading data. */
    load(options?: DevExpress.data.LoadOptions): Promise<any> & JQueryPromise<any> {
        // console.log("load", options);
        const dfd = Deferred();
        let auxFilter = this.filter;
        if (typeof auxFilter === "function") auxFilter = auxFilter();
        this.conn.list(this.resource, auxFilter, options).then((resp) => {
            if (resp.status == "success") {
                let totalCount: number;
                if (resp["totalCount"]) totalCount = Number(resp["totalCount"]);
                else totalCount = resp.data.length;
                dfd.resolve({data: resp.data, totalCount: totalCount});
                // dfd.resolve(resp.data);
            } else {
                let errorMsg: string = resp.data["error"] + ": " + resp.data["errorMessage"];
                dfd.reject(errorMsg);
            }
        }).catch((reason) => {
            dfd.reject(reason);
        });
        return dfd.promise() as any;
    }
}