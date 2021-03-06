/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import _ from 'lodash';
import 'isomorphic-fetch';

export function makeRequest(method, options){

    let fetchOptions = {
        method: 'POST',
        headers:         {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };
    if(options){
        fetchOptions.body = JSON.stringify({
            methodName: method,
            data: options
        });
    }
    return fetch('/invoke', fetchOptions)
        .then( response => {
            //console.log('Received response: ' + JSON.stringify(response, null, 4));
            //console.log('Received response: ' + response.status);
            //console.log('Received response: ' + response.statusText);
            //console.log(response.headers.get('Content-Type'));
            if (response.status >= 200 && response.status < 300) {

                return response.text()
                    .then(responseText => {
                        //console.log('Response text: ' + responseText);
                        let jsonData = {};
                        try{
                            jsonData = JSON.parse(responseText);
                        } catch(e){
                        }
                        if(jsonData.error === true){
                            let errorText = '';
                            if(_.isArray(jsonData.errors)){
                                jsonData.errors.forEach(errText => {
                                    errorText += '\n' + errText;
                                });
                            } else {
                                errorText = JSON.stringify(jsonData.errors);
                            }
                            throw Error(errorText);
                        }
                        return jsonData;
                    });
            } else {
                throw Error(response.statusText);
            }
        });

}



export function getAuthToken(username, password) {

    return makeRequest({ uri: authenticationUrl, method: 'POST', body: { username, password } })
        .then( jsonData => {
            if(jsonData.token){
                return jsonData.token;
            } else {
                throw Error('Authentication failed: token is missing in the response from ' + authenticationUrl);
            }
        });
}

export function setAuthToken(token){
    authenticationToken = token;
}


export function getJSONSchema(uri){

    return makeRequest({
        uri,
        method: 'GET',
        headers: {
            'Accept': 'application/schema+json'
        }
    });

}

export function getALPS(uri){

    return makeRequest({
        uri,
        method: 'GET',
        headers: {
            'Accept': 'application/alps+json'
        }
    });

}

export function post(uri, body){

    return makeRequest({
        uri,
        method: 'POST',
        body
    });

}

export function patch(uri, body){

    return makeRequest({
        uri,
        method: 'PATCH',
        body
    });

}

export function del(uri){

    return makeRequest({
        uri,
        method: 'DELETE'
    });

}

export function get(uri){

    return makeRequest({ uri });


    //return Promise.resolve().then( () => {
    //    let jsonData = null;
    //    const curTimestamp = Date.now();
    //    if(uri){
    //        const cacheItem = requestsCache.get(uri);
    //        if(cacheItem){
    //            if((curTimestamp - cacheItem.regTimestamp) < REQ_CACHE_TTL){
    //                jsonData = cacheItem.jsonData;
    //                //console.log('REST API from cache with key: ' + uri);
    //            } else {
    //                requestsCache.delete(uri);
    //            }
    //        }
    //    }
    //    return jsonData;
    //}).then( jsonData => {
    //    if(!jsonData){
    //        return makeRequest({ uri })
    //            .then( jsonData => {
    //                requestsCache.set(uri, { jsonData, regTimestamp: Date.now() });
    //                //console.log('REST API set cache with key: ' + uri);
    //                return jsonData;
    //            });
    //    } else{
    //        return jsonData;
    //    }
    //});

}

