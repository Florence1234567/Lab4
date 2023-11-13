/////////////////////////////////////////////////////////////////////
// Use this class to insert into middlewares into the pipeline
// 
/////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
/////////////////////////////////////////////////////////////////////
import * as CachedRequestsManager from "./models/CachedRequestsManager"; 

export default class MiddlewaresPipeline {
    constructor() {
        this.middlewares = [];
    }
    add(middleware) {
        this.middlewares.push(middleware);
    }
    handleHttpRequest(HttpContext) {
        for (let middleware of this.middlewares) {
            if (middleware(HttpContext)) {
                CachedRequestsManager.get()
                return true;
            }
        }
        return false;
    }
}