import testFetch from "../__test__/test_fetch";
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
  /**
   * @param {*} baseUrl - the base url refers to the URL of the backend
   * @param {*} jwtToken - the jwtToken is the authentification token which is taken from local storage
   * @param {*} activateTestMode - this is the boolean used for testing
   * @param {*} customEndpoints - this is a boolean which can be set to true to use personalised endpoint
   */
  constructor(baseUrl, customEndpoints, activateTestMode) {
    this.baseUrl =
      baseUrl === undefined
        ? `${process.env.REACT_APP_BACKEND_URL_DEV}`
        : baseUrl;
    this.activateTestMode =
      activateTestMode === undefined ? false : activateTestMode;
    this.customEndpoints =
      customEndpoints === undefined ? true : customEndpoints;
  }

  /**
   * This is a method for sending http requests
   *
   * @param {*} URL - the url to call the request to in the form ``this.baseUrl}/resourceEndpoint/METHOD``
   * @param {*} method - an HTTP method such as ["GET", "POST"]
   * @param {*} body - has to be a stringified serializable JSON string, use ``JSON.stringify(param)``
   */
  async HTTPcall(URL, method, body) {
    let response = {};
    const HTTPRequest = this.activateTestMode ? testFetch : fetch;
    if (body === undefined) {
      await HTTPRequest(URL, { method: method })
        .then((res) => {
          response.statusCode = res.status;
          return res.json();
        })
        .then((res) => {
          response.resource = res;
          let _ = this.activateTestMode
            ? ""
            : console.log(`${method} ${URL} backend response`, res);
        });
    } else {
      await HTTPRequest(URL, {
        method: method,
        body: JSON.stringify(body),
      }).then((res) => {
        let _ = this.activateTestMode
          ? ""
          : console.log(`${method} ${URL} backend response`, res);
        response.statusCode = res.status;
      });
    }
    return response;
  }

  /**
   * This is an auxiliary function used to enable the use of third party API's by passing
   * "" as the resourceEndpoint
   *
   * @param {*} resourceEndpoint - the enpoint of the base url
   * @param {*} HTTPmethod - the method that wants to be called on the customed endpoint
   *
   * @returns - baseUrl/resourceEndpoint
   */
  constructUrl(resourceEndpoint, HTTPmethod) {
    if (resourceEndpoint === "" || undefined) {
      return `${this.baseUrl}`;
    } else {
      return `${this.baseUrl}/${resourceEndpoint}/${
        this.customEndpoints ? HTTPmethod : ""
      }`;
    }
  }

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
  async putResource(resourceEndpoint, resource) {
    return this.HTTPcall(
      this.constructUrl(resourceEndpoint, "POST"),
      "POST",
      resource
    );
  }

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
  async getResource(resourceEndpoint) {
    return this.HTTPcall(this.constructUrl(resourceEndpoint, "GET"), "GET");
  }

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
  async deleteResource(resourceEndpoint, resourceKey) {
    return this.HTTPcall(
      this.constructUrl(resourceEndpoint, "DELETE"),
      "DELETE",
      resourceKey
    );
  }
}
