const Voting = artifacts.require("Voting");
const Passport = artifacts.require("Passport");

module.exports = function(deployer) {
  deployer.deploy(Voting, Passport.address); 
};