const { Web3 } = require('web3');
const fs = require('fs');

const passportContractFile = fs.readFileSync('/Users/maksym/work/b_passport/build/contracts/Passport.json');
const passportContractData = JSON.parse(passportContractFile);
const passportAbi = passportContractData.abi;
const passportContractAddress = '0x3F8a0CB65F421F7CAb18871bE452e37eE4Ca83c3';

const votingContractFile = fs.readFileSync('/Users/maksym/work/b_passport/build/contracts/Voting.json');
const votingContractData = JSON.parse(votingContractFile);
const votingAbi = votingContractData.abi;
const votingContractAddress = '0x5407a860bF718fb36C9888B68eAbA7b9BA1299eb';


const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

const passportContract = new web3.eth.Contract(passportAbi, passportContractAddress);
const votingContract = new web3.eth.Contract(votingAbi, votingContractAddress);





async function addPerson(name, age, nationality,role, secretKey) {
    const roleValue = (role === 'Moderator') ? 1 : (role === 'User') ? 2 : 0;
    const account = web3.eth.accounts.privateKeyToAccount(secretKey);
    web3.eth.accounts.wallet.add(account);

    const data = passportContract.methods.addPerson(name, age, nationality,roleValue).encodeABI();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
    const nonce = await web3.eth.getTransactionCount(account.address);

    const rawTransaction = {
        from: account.address,
        to: passportContractAddress,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: data,
        nonce: nonce,
    };
    // allowance
    //aproval
    //decimal
    

    const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, secretKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log('Person added successfully. Transaction hash:', receipt.transactionHash);
}

async function createVoting(secretKey){
    const account = web3.eth.accounts.privateKeyToAccount(secretKey);
    web3.eth.accounts.wallet.add(account);

    const nonce = await web3.eth.getTransactionCount(account.address, 'pending');

    console.log('nonce',nonce)

    const data = votingContract.methods.createVote('create voting', 'create description').encodeABI();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;

    console.log('data',data)

    console.log('data',data)

    const rawTransaction = {
        from: account.address,
        to: votingContractAddress,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: data,
        nonce: nonce,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, secretKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log('Voting added successfully. Transaction hash:', receipt.transactionHash);
}

async function getVoteDetails(secretKey, voteId){
    const account = web3.eth.accounts.privateKeyToAccount(secretKey);

    web3.eth.accounts.wallet.add(account);

    try {
        const result = await votingContract.methods.getVoteDetails(voteId).call({ from: account.address });

        console.log('Vote:', result);
    } catch (error) {
        console.error('Error fetching vote details:', error);
    }
}


async function vote(secretKey){
    const account = web3.eth.accounts.privateKeyToAccount(secretKey);

    web3.eth.accounts.wallet.add(account);

    const data = votingContract.methods.vote(1,0).encodeABI();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
    const nonce = await web3.eth.getTransactionCount(account.address);

    const rawTransaction = {
        from: account.address,
        to: votingContractAddress,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: data,
        nonce: nonce,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, secretKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log('Voting successfully. Transaction hash:', receipt.transactionHash);
}

async function closeVote(voteId, secretKey){
    const account = web3.eth.accounts.privateKeyToAccount(secretKey);
    web3.eth.accounts.wallet.add(account);

    const data = votingContract.methods.closeVote(voteId).encodeABI();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
    const nonce = await web3.eth.getTransactionCount(account.address);

    const rawTransaction = {
        from: account.address,
        to: votingContractAddress,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: data,
        nonce: nonce,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, secretKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log('Voting successfully closed. Transaction hash:', receipt.transactionHash);
}

// Example interaction: Getting person information
async function getPersonInfo(personAddress) {
    const result = await passportContract.methods.getPerson(personAddress).call();
    console.log('Person Information:', result);
}

// Call functions
//addPerson('R', 21, 'Lvi2v', 'Moderator', '0x480036eecfc2004ce0221ec61cad1d956d783c7812b70e3afab5eef033ce73ab');
//getPersonInfo('0x0906aDb40b5810977D6f272798047A05FD621c05')

//createVoting('0xd725679cc9f6ea8f68c501c4d7c2d67b6f2bd7ee3a98e8257301102b17e97875')

//createVoting('0x480036eecfc2004ce0221ec61cad1d956d783c7812b70e3afab5eef033ce73ab')



//getVoteDetails('0x95fe4dcd696c5137fb16bc1ef0f35209de3f1948e3d4ea8b3b6c9fe291ff9119',1)

vote('0x95fe4dcd696c5137fb16bc1ef0f35209de3f1948e3d4ea8b3b6c9fe291ff9119')

//vote('0xd725679cc9f6ea8f68c501c4d7c2d67b6f2bd7ee3a98e8257301102b17e97875')

//closeVote(1, '0x728cacca26805b228c7ab66112f1efd2bed640e2333a7ebf543d36ab0f0306b6')


//createVoting('0x480036eecfc2004ce0221ec61cad1d956d783c7812b70e3afab5eef033ce73ab')



потрібно переробити на використання ethers
