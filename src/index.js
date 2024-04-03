
const { ethers, JsonRpcProvider } = require('ethers');
const fs = require('fs');

const passportContractFile = fs.readFileSync('/Users/maksym/work/b_passport/build/contracts/Passport.json');
const passportContractData = JSON.parse(passportContractFile);
const passportAbi = passportContractData.abi;
const passportContractAddress = '0x3F8a0CB65F421F7CAb18871bE452e37eE4Ca83c3';

const votingContractFile = fs.readFileSync('/Users/maksym/work/b_passport/build/contracts/Voting.json');
const votingContractData = JSON.parse(votingContractFile);
const votingAbi = votingContractData.abi;
const votingContractAddress = '0x5407a860bF718fb36C9888B68eAbA7b9BA1299eb';

const provider = new JsonRpcProvider('https://rpc-mumbai.maticvigil.com');

function generateContract(address, abi, walletKey){
    const wallet = new ethers.Wallet(walletKey, provider);
    return new ethers.Contract(address, abi, wallet);
}

async function addPerson(name, age, nationality, role, walletKey) {
    const passportContract = generateContract(passportContractAddress, passportAbi, walletKey)
    const roleValue = (role === 'Moderator') ? 1 : (role === 'User') ? 2 : 0;

    const transaction = await passportContract.addPerson(name, age, nationality, roleValue);
    await transaction.wait();

    console.log('Person added successfully. Hash:', transaction.hash);
}

async function createVoting(votingTitle, votingDescription, walletKey) {
    const votingContract = generateContract(votingContractAddress, votingAbi, walletKey)
    const transaction = await votingContract.createVote(votingTitle, votingDescription);
    await transaction.wait();

    console.log('Voting added successfully. Hash:', transaction.hash);

    // як працює впринципі гас ліміт гас прайс параметри
    // які бепи транзції
    1559
    
}

async function getVoteDetails(voteId, walletKey) {
    try {
        const votingContract = generateContract(votingContractAddress, votingAbi, walletKey);
        const vote = await votingContract.getVoteDetails(voteId);
        console.log('Vote details:', vote);
    } catch (error) {
        console.error('Error fetching vote details:', error);
    }
}

async function vote(voteId, voteOption, walletKey) {
    const votingContract = generateContract(votingContractAddress, votingAbi, walletKey)
    const transaction = await votingContract.vote(voteId, voteOption);
    await transaction.wait();

    console.log('transaction',transaction)
 

    console.log('Voting successfully. Hash:', transaction.hash);
}

async function closeVote(voteId, walletKey) {
    const votingContract = generateContract(votingContractAddress, votingAbi, walletKey)
    const transaction = await votingContract.closeVote(voteId);
    await transaction.wait();

    console.log('Voting successfully closed. Hash:', transaction.hash);
}

async function getPersonInfo(personAddress, walletKey) {
    const passportContract = generateContract(passportContractAddress, passportAbi, walletKey)
    const result = await passportContract.getPerson(personAddress);
    console.log('Person Information:', result);
}

//Add Person

const privateKey = 'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7'

//addPerson('Maksym', 21, 'Ukraine', 'Moderator', privateKey)

getPersonInfo('0x9D22b8C9572b9A341a2839F9845fcE0DDD146563',privateKey)

//createVoting('Test vote title', 'Test voting description', 'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7')

//getVoteDetails(2,'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7')

//vote(2,1,'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7');

//closeVote(2,'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7')


//error  Only the creator can close the vote
//closeVote(1,'f1913ce0db08de0708d23ccccacf7af4b79d065d9e5eb15514e7c85d4c0b71b7')




