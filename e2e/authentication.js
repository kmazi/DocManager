const config = require('./config');
const faker = require('faker');

const randomNum = Math.ceil(Math.random(1000) * 1000);
const username = faker.name.findName().split(' ')[0];
const email = faker.internet.email();

module.exports = {
  'Register a new user': browser =>
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
    .click('#signup')
    .pause(1000)
    .waitForElementVisible('div#docheader')
    .pause(1000)
    .assert.containsText('div#docheader span.right a',
    `Hi ${username}! Sign Out`)
    .pause(1000)
    .click('div#docheader span.right a'),

  'Show error for incomplete fields': browser =>
  browser
    .waitForElementVisible('body')
    .pause(1000)
    .click('#signupbtn')
    .waitForElementVisible('div#signupform')
    .pause(1000)
    .setValue('#signupform input[name=username]', username)
    .pause(1000)
    .setValue('#signupform input[type=email]', '')
    .pause(1000)
    .setValue('#signupform input[name=password]', 'test')
    .pause(1000)
    .setValue('#signupform input[name=comfirmpassword]', 'test')
    .pause(1000)
    .click('#signup')
    .assert.containsText('#swal2-title', 'Error Signing up')
    .pause(1000),

  'Log a user in': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .waitForElementVisible('#signinform')
    .pause(1000)
    .assert.containsText('#signinform #signin', 'SUBMIT')
    .pause(1000)
    .setValue('#signinform input[type=text]', username)
    .pause(1000)
    .setValue('#signinform input[type=password]', 'testing1')
    .pause(1000)
    .click('#signin')
    .pause(1000)
    .waitForElementVisible('div#docheader')
    .pause(1000)
    .assert.containsText('div#docheader span.right a',
    `Hi ${username}! Sign Out`),

  'Create a new document': browser => browser
    .waitForElementVisible('a#createdoclink')
    .pause(1000)
    .click('a#createdoclink')
    .pause(1000)
    .waitForElementVisible('#docform')
    .assert.elementPresent('#docform input[name=title]')
    .pause(1000)
    .setValue('#docform input[name=title]',
    `My test document number ${randomNum}`)
    .pause(1000)
    .keys(browser.Keys.TAB)
    .pause(1000)
    .keys(['T', 'h', 'i', 's'])
    .keys(browser.Keys.SPACE)
    .keys(['i', 's'])
    .keys(browser.Keys.SPACE)
    .keys(['g', 'r', 'e', 'a', 't'])
    .pause(1000)
    .click('#docform #docrole')
    .pause(1000)
    .click('#docform button[type=submit]')
    .waitForElementVisible('#swal2-title')
    .assert.containsText('#swal2-title', 'successful')
    .pause(1000)
    .click('.swal2-confirm.swal2-styled'),

  'Show error message when an empty doc body is sent': browser => browser
  .click('#docform input[name=title]')
  .pause(1000)
  .setValue('#docform input[name=title]',
    `My test document number ${randomNum}`)
  .click('#docform #docrole')
  .pause(1000)
  .click('#docform button[type=submit]')
  .waitForElementVisible('#swal2-title')
  .pause(2000)
  .assert.containsText('#swal2-title', 'Incomplete form')
  .pause(1000)
  .click('.swal2-confirm.swal2-styled')
  .pause(1000),

  'View own user profile': browser => browser
  .click('a#userprofilelink')
  .pause(1000)
  .assert.elementPresent('#userview')
  .assert.attributeContains('#userview input', 'disabled', true)
  .assert.cssClassPresent('#userview #submitedit', 'hide'),

  'Edit own user profile': browser => browser
  .click('#editbtn')
  .pause(1000)
  .clearValue('#userview #userEmail')
  .pause(1000)
  .setValue('#userview #userEmail', 'memunat@gmail.com')
  .pause(1000)
  .setValue('#userview #oldpassword', 'testing1')
  .pause(1000)
  .setValue('#userview #newpassword', 'testing')
  .pause(1000)
  .click('#userview button#submitedit')
  .waitForElementVisible('#swal2-title')
  .assert.containsText('#swal2-title', 'Update successful')
  .pause(1000)
  .click('.swal2-confirm.swal2-styled')
  .pause(1000)
  .click('div#docheader span.right a'),

  'Show error message for invalid credentials': browser =>
  browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .waitForElementVisible('#signinform')
    .pause(1000)
    .assert.containsText('#authbuttons span#signinbtn', 'SIGNIN')
    .pause(1000)
    .setValue('#signinform input[type=text]', username)
    .pause(1000)
    .setValue('#signinform input[type=password]', 'memunat')
    .pause(1000)
    .click('#signin')
    .pause(1000)
    .assert.containsText('#swal2-title', 'Error Signing in'),

  'Show "manage user" option when user is admin': browser =>
    browser
    .url(config.url)
    .waitForElementVisible('body')
    .pause(1000)
    .waitForElementVisible('#signinform')
    .pause(1000)
    .setValue('#signinform input[type=text]', 'touchstone')
    .pause(1000)
    .setValue('#signinform input[type=password]', 'testing1')
    .pause(1000)
    .click('#signin')
    .pause(1000)
    .waitForElementVisible('div#docheader')
    .assert.elementPresent('a#manageusers')
    .assert.cssClassNotPresent('a#manageusers', 'hide')
    .pause(1000)
    .click('a#manageusers')
    .waitForElementVisible('#viewusers table')
    .assert.elementPresent('#viewusers table')
    .click('div#docheader span.right a')
    .end()
};
