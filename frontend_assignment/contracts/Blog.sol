//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@appliedzkp/semaphore-contracts/base/SemaphoreCore.sol";
import "@appliedzkp/semaphore-contracts/interfaces/IVerifier.sol";
import "@appliedzkp/semaphore-contracts/base/SemaphoreGroups.sol";

contract Blog is SemaphoreCore, SemaphoreGroups, Ownable{
    uint256 groupId = 0;
    uint8 depth = 20;
    uint256 totalFeeds;
    uint x;
    using Counters for Counters.Counter;
    Counters.Counter private _feedIds;

    event FeedCreated(
        uint256 id,
        string title,
        string description,
        string category,
        string coverImageHash,
        string date
    );

    // The external verifier used to verify Semaphore proofs.
    IVerifier public verifier;

    constructor(address _verifier) {
        console.log("Blogs deployed");
        verifier = IVerifier(_verifier);
        _createGroup(groupId,depth,0);
    }

    function addMember(uint256 commitmentId) public {
        _addMember(groupId,commitmentId);
    }

    /*
     * I created a struct here named Feed.
     * A struct is a custom datatype where we can customize what we want to hold inside it.
     */
    struct Feed {
        uint256 id;
        string title;
        string description;
        string category;
        string coverImageHash;
        string date;
    }

    /*
     * I declare variable feeds that let me store an array of structs.
     * This is what holds all the feeds anyone ever created.
     */
    Feed[] feeds;

    /*
     * This function will be used to get all the feeds.
     */
    function getAllFeeds() public view returns (Feed[] memory) {
        /*
         * This is a function that will return the length of the array.
         * This is how we know how many feeds are in the array.
         */
        return feeds;
    }

    /*
     * This function will be used to get the number of feeds.
     */
    function getTotalFeeds() public view returns (uint256) {
        return totalFeeds;
    }

    /*
     * This is a function that will be used to get a feed.
     * It will take in the following parameters:
     * - _id: The id of the feed
     */
    function getFeed(uint256 _id) public view returns (Feed memory) {
        /*
         * We are using the mapping function to get the feed from the mapping.
         * We are using the _id variable to get the feed from the mapping.
         */
        return feeds[_id];
    }

    /*
     * This function will be used to create a news feed.
     * It will take in the following parameters:
     * - _title: The title of the feed
     * - _description: The description of the feed
     * - _location: The location of the feed
     * - _category: The category of the feed
     * - _coverImageHash: The hash of the cover image of the feed
     * - _date: The date of the feed
     */
    
    function createFeed(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _coverImageHash,
        string memory _date,
        bytes32 _signal,
        uint256 root,
        uint256 _nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata _proof
    ) public {
        // Validation
        require(bytes(_coverImageHash).length > 0);
        require(bytes(_title).length > 0);
        require(bytes(_description).length > 0);
        require(bytes(_category).length > 0);

        _verifyProof(
             _signal, 
             root, 
             _nullifierHash, 
             externalNullifier, 
             _proof,
             verifier
        );

        totalFeeds++;

        /* Increment the counter */
        _feedIds.increment();

        /*
         * We are using the struct Feed to create a news feed.
         To create a news feed* We use the id, title, description, location, category, coverImageHash, date, and author variables.
         */
         console.log("In contrqct now ");
         console.log(msg.sender);
        feeds.push(
            Feed(
                _feedIds.current(),
                _title,
                _description,
                _category,
                _coverImageHash,
                _date
            )
        );

        /*
         * We are using the event FeedCreated to emit an event.
         To emit an event*, We use the id, title, description, location, category, coverImageHash, date, and author variables.
         */
        emit FeedCreated(
            _feedIds.current(),
            _title,
            _description,
            _category,
            _coverImageHash,
            _date
        );
    }
}