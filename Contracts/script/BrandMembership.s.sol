// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BrandMembership} from "../src/BrandMembership.sol";

contract BrandMembershipScript is Script {
    BrandMembership public brandMembership;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        brandMembership = new BrandMembership();

        vm.stopBroadcast();
    }
}
