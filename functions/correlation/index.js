const sdk = require("@salesforce/salesforce-sdk");

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

  function phi([n00, n01, n10, n11]) {
    return (
      (n11 * n00 - n10 * n01) /
      Math.sqrt((n10 + n11) * (n00 + n01) * (n01 + n11) * (n00 + n10))
    );
  }

  function addEntry(events, squirrel) {
    JOURNAL.push({ events, squirrel });
  }

  function journalEvents(journal) {
    let events = [];
    for (let entry of journal) {
      for (let event of entry.events) {
        if (!events.includes(event)) {
          events.push(event);
        }
      }
    }
    return events;
  }

  function tableFor(event, journal) {
    let table = [0, 0, 0, 0];
    for (let i = 0; i < journal.length; i++) {
      let entry = journal[i],
        index = 0;
      if (entry.events.includes(event)) index += 1;
      if (entry.squirrel) index += 2;
      table[index] += 1;
    }
    return table;
  }

  addEntry(["work", "touched tree", "pizza", "running", "television"], false);
  addEntry(
    [
      "work",
      "ice cream",
      "cauliflower",
      "lasagna",
      "touched tree",
      "brushed teeth"
    ],
    false
  );
  addEntry(["weekend", "cycling", "break", "peanuts", "beer"], true);
  addEntry(["weekend", "running", "break", "peanuts", "wine"], true);

  logger.info(
    `Invoking Correlation with payload ${JSON.stringify(event.data || {})}`
  );

  const results = await context.org.data.query("SELECT Id, Name FROM Account");
  logger.info(JSON.stringify(results));

  let r = [];
  for (let event of journalEvents(JOURNAL)) {
    r.push(event + ":", phi(tableFor(event, JOURNAL)));
  }

  return r;
};
