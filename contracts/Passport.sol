// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Passport {
    enum Role { Owner, Moderator, User }

    struct Person {
        string name;
        uint256 age;
        string nationality;
        Role role;
        address owner;
    }

    mapping(address => Person) public people;

    event PersonAdded(address indexed personAddress, string name, uint256 age, string nationality, Role role);

    modifier onlyOwner() {
        require(msg.sender == people[msg.sender].owner, "Only the owner can call this function");
        _;
    }

    modifier onlyModerator(address _personAddress) {
        require(people[_personAddress].role == Role.Moderator, "Only moderators can call this function");
        _;
    }

    modifier onlyUser(address _personAddress) {
        require(people[_personAddress].role == Role.User, "Only users can call this function");
        _;
    }

    constructor() {
        people[msg.sender] = Person("", 0, "", Role.Owner, msg.sender);
        emit PersonAdded(msg.sender, "", 0, "", Role.Owner);
    }

    function addPerson(string memory _name, uint256 _age, string memory _nationality, Role _role) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than 0");
        require(bytes(_nationality).length > 0, "Nationality cannot be empty");

        require(people[msg.sender].owner == address(0), "Person already exists");

        people[msg.sender] = Person(_name, _age, _nationality, _role, msg.sender);

        emit PersonAdded(msg.sender, _name, _age, _nationality, _role);
    }

function getPerson(address _personAddress) public view returns (string memory, uint256, string memory, Role) {
    require(people[_personAddress].owner != address(0), "User does not exist");

    return (
        people[_personAddress].name,
        people[_personAddress].age,
        people[_personAddress].nationality,
        people[_personAddress].role
    );
}
}
