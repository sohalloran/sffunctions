const sdk = require("@salesforce/salesforce-sdk");
const axios = require("axios");
/**
 * Describe Correlation here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param {import("@salesforce/salesforce-sdk").InvocationEvent} event:   represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param {import("@salesforce/salesforce-sdk").Context} context: represents the connection to Evergreen and your Salesforce org.
 * @param {import("@salesforce/salesforce-sdk").Logger} logger:  logging handler used to capture application logs and traces specific
 *                 to a given execution of a function.
 */
module.exports = async function (event, context, logger) {
  const JOURNAL = [];
  const r = [];

  const phi = ([n00, n01, n10, n11]) => {
    // prettier-ignore
    return  (n11 * n00 - n10 * n01) / Math.sqrt((n10 + n11) * (n00 + n01) * (n01 + n11) * (n00 + n10));
  };

  const addEntry = (events, IsConverted) => {
    JOURNAL.push({ events, IsConverted });
  };

  const journalEvents = (journal) => {
    let events = [];
    for (let entry of journal) {
      for (let event of entry.events) {
        if (!events.includes(event)) {
          events.push(event);
        }
      }
    }
    return events;
  };

  const tableFor = (event, journal) => {
    let table = [0, 0, 0, 0];
    for (let i = 0; i < journal.length; i++) {
      // prettier-ignore
      let entry = journal[i], index = 0;
      if (entry.events.includes(event)) index += 1;
      if (entry.IsConverted) index += 2;
      table[index] += 1;
    }
    return table;
  };

  logger.info(
    `Invoking Correlation with payload ${JSON.stringify(event.data || {})}`
  );

  const results = await context.org.data.query(
    "SELECT Id, LeadSource, Industry, Rating, IsConverted FROM Lead"
  );

  logger.info(`Invoking Correlation with payload ${JSON.stringify(results)}`);

  for (let l of results.records) {
    addEntry([l.LeadSource, l.Industry, l.Rating], l.IsConverted);
  }

  for (let event of journalEvents(JOURNAL)) {
    r.push(event + ":" + phi(tableFor(event, JOURNAL)));
  }

  let url = `https://soh-wait.herokuapp.com/wait/`;
  for (let i = 1; i < 5; i++) {
    url = `https://soh-wait.herokuapp.com/wait/${i * 10}`;
    try {
      logger.info(url);
      const slowresp = await axios.get(url);
      logger.info(slowresp.data);
      r.push(` Response ->  ${JSON.stringify(slowresp.data)}`);
    } catch (error) {
      logger.info(error);
      r.push(` Error -> ${error}`);
    }
  }

  const mySecretsMap = context.secrets.get(`my-secret`);
  const pass = mySecretsMap.get("pass");
  r.push(` pass -> ${pass}`);

  return r;
};
