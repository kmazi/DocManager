const config = require('./config');
const faker = require('faker');

const randomNum = Math.ceil(Math.random(1000) * 1000);
const fullname = faker.name.findName();
const username = `${fullname}${randomNum}`;
const email = faker.internet.email();

module.exports = {
  'Registers a new user': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .click('#signupbtn')
    .waitForElementVisible('div#signupform')
    .pause(1000)
    .setValue('#signupform input[name=username]', username)
    .pause(1000)
    .setValue('#signupform input[type=email]', email)
    .pause(1000)
    .setValue('#signupform input[name=password]', 'testing1')
    .pause(1000)
    .setValue('#signupform input[name=comfirmpassword]', 'testing1')
    .pause(1000)
    .click('#Fellowlabel')
    .pause(1000)
    .click('#signupbtn')
    .pause(1000)
    .waitForElementVisible('div#docheader')
    .pause(1000)
    .assert.containsText('div#docheader span.right a',
    `Hi ${username}! Sign Out`)
    .pause(1000)
    .click('div#docheader span.right a'),

  'Shows error for incomplete fields': browser =>
  browser
    .waitForElementVisible('body')
    .pause(1000)
    .click('#signupbtn')
    .waitForElementVisible('div#signupform')
    .pause(1000)
    .setValue('#signupbtn input[name=username]', username)
    .pause(1000)
    .setValue('#signupbtn input[name=email]', '')
    .pause(1000)
    .setValue('input#registerPassword', 'test')
    .pause(1000)
    .setValue('input[name=passwordConfirmation]', 'test')
    .pause(1000)
    .click('#signupbtn')
    .assert.containsText('#swal2-title', 'Error Signing up')
    .pause(1000),

  'Log a user in': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .waitForElementVisible('#signinform')
    .pause(1000)
    .assert.containsText('#authbuttons span#signinbtn', 'SignIn')
    .pause(1000)
    .setValue('#signinform input[type=text]', username)
    .pause(1000)
    .setValue('#signinform input[type=password]', 'memunat')
    .pause(1000)
    .click('#signinbtn')
    .pause(1000)
    .waitForElementVisible('div#docheader')
    .pause(1000)
    .assert.containsText('div#docheader span.right a',
    `Hi ${username}! Sign Out`)
    .pause(1000)
    .click('div#docheader span.right a'),

  'Returns error for invalid credentials': browser =>
  browser
    .waitForElementVisible('body')
    .pause(1000)
    .waitForElementVisible('#signinform')
    .pause(1000)
    .assert.containsText('#authbuttons span#signinbtn', 'SignIn')
    .pause(1000)
    .setValue('#signinform input[type=text]', username)
    .pause(1000)
    .setValue('#signinform input[type=password]', 'memunat')
    .pause(1000)
    .click('#signinbtn')
    .pause(1000)
    .assert.containsText('#swal2-title', 'Error Signing in')
    .pause(1000)
    .end()
};
