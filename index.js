// index.js
"use strict";
var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var SeliniumActions = require("./helpers.js");
var { Given, When, Then } = require("cucumber");
var { expect } = require("chai");

const load = async () => {
  var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  var SeliniumHelper = new SeliniumActions(driver);
};

load();

Given("that I am on my Gmail inbox page", async () => {
  await SeliniumHelper.loginGmail();
  await SeliniumHelper.openNewMessageModal();
});
