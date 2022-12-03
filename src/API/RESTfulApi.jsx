// import testFetch from "../__tests__/test_fetch";
/**
 * This is an implementation of a RESTful Api using the fetch api
 *
 * to test this class you can call the update fetch function
 *
 * __Common Successful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | OK | 200 | Standard response for successful HTTP requests |
 * | Created | 201 | server does'nt have a current representation and the PUT request successfully creates one |
 * | Updated | 204 | if the server has a current representation and is successfully modified |
 *
 * __Common Unsuccessful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | Unauthorized | 401 |  authentication is required and has failed |
 * | Forbidden | 403 | the request was successful but the user may not have the necessary permissions for a resource |
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes for more information
 */
 export default class RESTfulApiInterface {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_BACKEND_URL_PROD}`;
    this.jwtToken = "Bearer " + localStorage.getItem("jwtToken");
    this.activateTestMode = false;
  }

  /**
   * This is an internal method used for sending http requests
   * @param {*} URL - the url to call the request to in the form ``this.baseUrl}/resourceEndpoint/METHOD``
   * @param {*} method - an HTTP method such as ["GET", "POST"]
   * @param {*} body - has to be a stringified serializable JSON string, use ``JSON.stringify(param)``
   * @returns response - an object returned by the backend
   */
  HTTPcall = async (URL, method, body) => {
    if (body == undefined) {
      return await fetch(URL, {
        headers: new Headers({
          "X-JWT": this.jwtToken,
        }),
        method,
      })
        .then((res) => {
          if (!res.ok) {
            console.log(URL, method, res);
            return [];
          } else {
            try {
              return res
                .json()
                .then((res) => {
                  try{
                    return JSON.parse(res).response
                  } catch(e) {
                    console.log(e)
                    return res.response
                  }
                })
                .catch((e) => {
                  console.log(`error from calling ${[URL, method]}`, e);
                  console.log("response:", res);
                  return [];
                });
            } catch (e) {
              console.log(`error from calling ${[URL, method]}`, e);
              console.log("response:", res);
              return [];
            }
          }
        })
        .catch((e) => {
          console.log(`first to resolve the first promise ${[URL, method]}`, e);
          return [];
        });
    } else {
      return await fetch(URL, {
        headers: new Headers({
          "X-JWT": this.jwtToken,
        }),
        method,
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (!res.ok) {
            console.log(URL, method, res);
            return [];
          } else {
            try {
              return res
                .json()
                .then((res) => {
                  try{
                    return JSON.parse(res).response
                  } catch(e) {
                    console.log(e)
                    return res.response
                  }
                })
                .catch((e) => {
                  console.log(`error from calling ${[URL, method]}`, e);
                  console.log("response:", res);
                  return [];
                });
            } catch (e) {
              console.log(`error from calling ${[URL, method]}`, e);
              console.log("response:", res);
              return [];
            }
          }
        })
        .catch((e) => {
          console.log(`first to resolve the first promise ${[URL, method]}`, e);
          return [];
        });
    }
  };

  /**
   * This will send an HTTP PUT request to the ``baseUrl/resourceEndpoint/CREATE`` endpoint
   * The HTTP PUT request method creates a new resource or replaces a representation of the target resource
   * with the request payload
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   * @param {*} resource - this is the object that will be posted to the specified backend
   *
   * @returns {*} statusCode - a ``<Promise>`` containing the status code of the request
   *
   * Side Effects:
   * - the URL and the response from the backend are logged to the console
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   *
   * If you send the same PUT request multiple times, the result will remain the same but
   * if you send the same POST request multiple times, you will receive different results.
   * PUT method is idempotent whereas POST method is not idempotent
   * @see https://stackoverflow.com/questions/630453/what-is-the-difference-between-post-and-put-in-http
   * for more information
   */
  putResource = async (resourceEndpoint, resource) => {
    return this.HTTPcall(
      `${this.baseUrl}/${resourceEndpoint}/WRITE`,
      "PUT",
      resource
    );
  };

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @returns {*} {statusCode, resource} - a ``<Promise>`` containing the status code and
   * the resource returned by the server of the request
   *
   * ### Dev Information
   *  - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  getResource = async (resourceEndpoint) => {
    return await this.HTTPcall(
      `${this.baseUrl}/${resourceEndpoint}/READ`,
      "GET"
    );
  };

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @param {*} resourceKey - string specifying the unique identifier of the resource to be deleted
   *
   * @returns {*} {statusCode} - a ``<Promise>`` containing the status code of the request
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  deleteResource = async (resourceEndpoint, resourceKey) => {
    return this.HTTPcall(
      `${this.baseUrl}/${resourceEndpoint}/DELETE`,
      "DELETE",
      resourceKey
    );
  };
}