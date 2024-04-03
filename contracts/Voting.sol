// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Passport.sol";

contract Voting {
    enum VoteOption { Option1, Option2, Option3 }

    struct Vote {
        address creator;
        string title;
        string description;
        mapping(uint8 => uint256) votesCount;
        bool isOpen;
    }

    mapping(uint256 => Vote) public votes;
    uint256 public voteCount;

    Passport passportContract;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    constructor(address _passportAddress) {
        passportContract = Passport(_passportAddress);
    }

 
function createVote(string memory _title, string memory _description) public {
    (string memory name, uint256 age, string memory nationality, Passport.Role role) = passportContract.getPerson(msg.sender);
    require(role == Passport.Role.Moderator, "Only moderators can create votes");

    voteCount++;
    Vote storage newVote = votes[voteCount];
    newVote.creator = msg.sender;
    newVote.title = _title;
    newVote.description = _description;
    newVote.isOpen = true;
}

function closeVote(uint256 _voteId) public {
    require(votes[_voteId].isOpen, "Vote is already closed");
    require(msg.sender == votes[_voteId].creator, "Only the creator can close the vote");

    (string memory name, uint256 age, string memory nationality, Passport.Role role) = passportContract.getPerson(msg.sender);
    require(role == Passport.Role.Moderator, "Only moderators can close votes");

    votes[_voteId].isOpen = false;
}

function vote(uint256 _voteId, uint8 _option) public {
    require(votes[_voteId].isOpen, "Vote is closed");

    (string memory name, uint256 age, string memory nationality, Passport.Role role) = passportContract.getPerson(msg.sender);
    require(role == Passport.Role.Moderator || role == Passport.Role.User, "Only moderators and users can vote"); 

    require(!hasVoted[_voteId][msg.sender], "You have already voted");

    hasVoted[_voteId][msg.sender] = true;
    votes[_voteId].votesCount[_option]++;
}

function getVoteDetails(uint256 _voteId) public view returns (string memory, string memory, bool) {
    require(votes[_voteId].isOpen, "Vote is closed");

    (, , , Passport.Role role) = passportContract.getPerson(msg.sender);
    require(role == Passport.Role.Moderator || role == Passport.Role.User || role == Passport.Role.Owner, "Only registered users and owners can get vote details");

    return (votes[_voteId].title, votes[_voteId].description, votes[_voteId].isOpen);
}

}