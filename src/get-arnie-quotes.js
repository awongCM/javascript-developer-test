const { httpGet } = require("./mock-http-interface");

const STATUS_CODE_KEYS = {
  [200]: "Arnie Quote",
  [500]: "FAILURE",
};

// handling exceptions
const ERROR_MESSAGE = "Malformed JSON Response";
const ERROR_KEY = "Unhandled Status Code";

const retrieveStatusKey = (status) => {
  return STATUS_CODE_KEYS[status] === undefined
    ? ERROR_KEY
    : STATUS_CODE_KEYS[status];
};

const parseAndRetrieveJSONBody = (body) => {
  try {
    let response = JSON.parse(body);
    if ("message" in response) {
      return response["message"];
    } else {
      // gives back whatever the server response comes back with
      return JSON.stringify(response);
    }
  } catch (error) {
    return ERROR_MESSAGE;
  }
};

const makeURLPromise = async (url) => {
  let response = await httpGet(url);
  const { status, body } = response;

  const message = parseAndRetrieveJSONBody(body);
  const statusKey = retrieveStatusKey(status);

  return {
    [statusKey]: message,
  };
};

const getArnieQuotes = async (urls) => {
  let urlPromises = urls.map(makeURLPromise);

  return Promise.all(urlPromises);
};

module.exports = {
  getArnieQuotes,
};
