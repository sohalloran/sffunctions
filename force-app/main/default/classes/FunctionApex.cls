public with sharing class FunctionApex {
    public static void test() {
        System.debug('Invoking MyFunction');

        functions.Function myFunction = functions.Function.get('MyFunction');
        functions.FunctionInvocation invocation = myFunction.invoke('{"fields":["Id","Name"]}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from MyFunction ' + jsonResponse);
    }

    //SOHFunction
    public static void testSOHFunction() {
        System.debug('Invoking SOHFunction');

        functions.Function myFunction = functions.Function.get('SOHFunction');
        functions.FunctionInvocation invocation = myFunction.invoke('{"fields":["Id","Name"]}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from SOHFunction ' + jsonResponse);
    }

    public static void testAccConOppInsertFunction() {
        System.debug('Invoking AccConOppInsert');

        functions.Function myFunction = functions.Function.get('AccConOppInsert');
        functions.FunctionInvocation invocation = myFunction.invoke('{"accountName":"soh","contactName":"Steve","opportunityName":"myopp"}');
        String jsonResponse = invocation.getResponse();

        System.debug('Response from AccConOppInsert ' + jsonResponse);
    }

    @AuraEnabled(cacheable=true)
    public static string correlation() {
        System.debug('Invoking AccConOtestCorrelationFunctionppInsert');
        functions.Function myFunction = functions.Function.get('correlation');
        functions.FunctionInvocation invocation = myFunction.invoke('{"fields":["Id","Name"]}');
        String jsonResponse = invocation.getResponse();
        System.debug('Response from testCorrelationFunction ' + jsonResponse);
        return jsonResponse;
    }
}