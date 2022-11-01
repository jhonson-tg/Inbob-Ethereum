const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// Instance of Web3
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = "Hithere";

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //  Creating a instance of contract and deploying it.
    // 1st line: this is how the javascript can contact with ethereum world.
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
        .send({ from: accounts[0], gas: '1000000' })
})

describe('Inbox', () => {
    it("Deploys a contract", () => {
        assert.ok(inbox.options.address);
    });

    it("has a default message", async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it("can change the message", async () => {
        await inbox.methods.setMessage("bye there!").send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, "bye there!");
    })
})