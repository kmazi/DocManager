var context = require.context('./spec', true, /calculatorSpec\.js$/);
context.keys().forEach(context);
