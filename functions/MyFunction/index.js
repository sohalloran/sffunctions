// functions/MyFunction/index.js

const sdk = require('@salesforce/salesforce-sdk');

/**
 * Describe MyFunction here.
 */
 module.exports = async function (event, context, logger) {
     logger.info('Invoking MyFunction...');

     // You can set a breakpoint here to inspect the variables that are passed in.

     // Insert a new Account with the name given in the event payload.
     const acct = new sdk.SObject('Account');
     const name = event.data.AccountToCreate__c || 'MyAccount'
     acct.setValue('Name', `${name}-${Date.now()}`);
     const insertResult = await context.org.data.insert(acct);
     logger.info(JSON.stringify(insertResult));

     // Query Accounts to verify that our new Account was created.
     const fields = event.data.fields ? event.data.fields.join(', ') : 'Id, Name, CreatedDate'
     const soql = `SELECT ${fields} FROM Account ORDER BY CreatedDate DESC LIMIT 5`;
     logger.info(soql);
     const queryResults = await context.org.data.query(soql);
     logger.info(JSON.stringify(queryResults));

     return queryResults;
}