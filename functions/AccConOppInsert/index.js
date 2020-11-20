const sdk = require('@salesforce/salesforce-sdk');

module.exports = async function execute(event, context, logger) {
    const payload = event.data;
    const uniqueId = Date.now();

    // Create a unit of work that inserts multiple objects.
    const work = context.org.unitOfWork;

    const account = new sdk.SObject('Account');
    account.setValue('Name', payload.accountName + uniqueId);
    work.registerNew(account);

    const contact = new sdk.SObject('Contact');
    contact.setValue('LastName', payload.contactName + uniqueId);
    contact.setValue('AccountId', account.fkId);
    work.registerNew(contact);

    const opportunity = new sdk.SObject('Opportunity');
    opportunity.setValue('Name', payload.opportunityName + uniqueId);
    opportunity.setValue('StageName', 'Prospecting');
    opportunity.setValue('CloseDate', Date.now());
    opportunity.setValue('AccountId', account.fkId);
    work.registerNew(opportunity);

    // Commit the unit of work.
    const response = await work.commit();
    if (response instanceof sdk.UnitOfWorkErrorResponse) {
        // If there was an error, log the root cause and throw an Error to indicate
        // a failed Function status
        const errMsg = `Failed to submit Unit of Work. Root cause: ${response.rootCause}`
        logger.error(errMsg);
        throw new Error(errMsg);
    }

    // Successful response handling
    logger.info(JSON.stringify(response));
    const result = { 'accountId' : response.getResults(account)[0].id,
                     'contactId' : response.getResults(contact)[0].id,
                     'opportunityId' : response.getResults(opportunity)[0].id };
    logger.info('Committed a Unit of Work');
    logger.info(JSON.stringify(result));

    return result;
}