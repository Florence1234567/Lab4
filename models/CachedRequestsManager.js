import * as utilities from "../utilities.js";
import * as serverVariables from "../serverVariables.js";
import { log } from "../log.js";
let repositoryCachesExpirationTime = serverVariables.get(
  "main.repository.CacheExpirationTime"
);

// Repository file data models cache
globalThis.caches = [];

export default class CachedRequestsManager {
  static add(url, content, ETags = "") {
    if (url != "") {
      CachedRequestsManager.clear(url);
      console.log("Ajout dans la cache avec l’url associé");
      caches.push({
        url,
        content,
        ETags,
        Expire_Time: utilities.nowInSeconds() + repositoryCachesExpirationTime,
      });
    }
  }
  static clear(url) {
    if (url != "") {
      let indexToDelete = [];
      let index = 0;
      for (let cache of caches) {
        if (cache.url == url) indexToDelete.push(index);
        index++;
      }
      utilities.deleteByIndex(caches, indexToDelete);
    }
  }
  static find(url) {
    try {
      if (url != "") {
        for (let cache of caches) {
          if (cache.url == url) {
            cache.Expire_Time = utilities.nowInSeconds() + repositoryCachesExpirationTime;
            console.log("Extraction de la cache avec l’url associé");
            return cache.content;
          }
        }
      }
    } catch (error) {
      console.log("repository cache error!", error);
    }
    return null;
  }
  static flushExpired() {
    let indexToDelete = [];
    let index = 0;
    let now = utilities.nowInSeconds();
    for (let cache of caches) {
      if (cache.Expire_Time < now) {
        console.log("Retrait de cache expirée avec l’url associé");
        indexToDelete.push(index);
      }
      index++;
    }
    utilities.deleteByIndex(caches, indexToDelete);
  }
  static get(HttpContext) {
    for (let cache of caches) {
      if (cache.url == HttpContext.req.url) {
        HttpContext.response.JSON(HttpContext.paylod, cache.ETag, true);
      }
    }
  }
}
// periodic cleaning of expired cached repository data
//setInterval(CachedRequestsManager.flushExpired,repositoryCachesExpirationTime * 1000);
log(BgWhite, FgBlack, "Periodic repository caches cleaning process started...");
