var context = require.context('./spec/serverspec/', true, /Spec\.js$/);
context.keys().forEach(context);
