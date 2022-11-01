const Voting = artifacts.require("./Voting.sol");
const { BN , expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');


contract("Voting", accounts => {

  const _owner = accounts[0];
  const _voter1 = accounts[1];
  const _voter2 = accounts[2];
  const _voter3 = accounts[3];
  const _notavoter = accounts[4];
  const _proposal1 = "prop1";
  const _proposal2 = "prop2";
  const _proposal3 = "prop3";

  let VotingInstance;


  describe("Complete Test", function () {
    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: _owner });
    });

    describe("Workflow", function () {

      describe("Workflow Proposals Registering", function () {
        beforeEach(async function () {
          await VotingInstance.addVoter(_voter1 , {from: _owner});
          await VotingInstance.addVoter(_voter2 , {from: _owner});
          await VotingInstance.addVoter(_voter3 , {from: _owner});
        });

        it("should emit event WorkflowStatusChange", async () => {
          expectEvent(await VotingInstance.startProposalsRegistering({from: _owner}), "WorkflowStatusChange",   {previousStatus: new BN(0), newStatus: new BN(1)});
        });

        it("only owner can change workflow ", async () => {  
          await expectRevert(VotingInstance.startProposalsRegistering({from: _voter1}),"Ownable: caller is not the owner");  
        });

        it("should create Genesis proposal", async () => {
          await VotingInstance.startProposalsRegistering({from: _owner});
          const genesis = await VotingInstance.getOneProposal(BN(0), {from: _voter1});
          expect(genesis.description).to.be.eql('GENESIS');  
        });
      });

      describe("Workflow End Proposals Registering", function () {
        beforeEach(async function () {
          await VotingInstance.addVoter(_voter1 , {from: _owner});
          await VotingInstance.addVoter(_voter2 , {from: _owner});
          await VotingInstance.addVoter(_voter3 , {from: _owner});
        });

        it("should revert if previous workflow not started yet ", async () => {
          await expectRevert(VotingInstance.endProposalsRegistering({from: _owner}),"Registering proposals havent started yet");
        });

        it("only owner can change workflow ", async () => {  
          await VotingInstance.startProposalsRegistering({from: _owner});
          await expectRevert(VotingInstance.endProposalsRegistering({from: _voter1}),"Ownable: caller is not the owner");  
        });

        it("should emit event WorkflowStatusChange", async () => {
          await VotingInstance.startProposalsRegistering({from: _owner});
          await VotingInstance.addProposal(_proposal1, {from: _voter1});
          await VotingInstance.addProposal(_proposal2, {from: _voter2});
          expectEvent(await VotingInstance.endProposalsRegistering({from: _owner}), "WorkflowStatusChange",   {previousStatus: new BN(1), newStatus: new BN(2)});
        });
      });

      describe("Workflow Start Voting Session", function () {
        beforeEach(async function () {
          await VotingInstance.addVoter(_voter1 , {from: _owner});
          await VotingInstance.addVoter(_voter2 , {from: _owner});
          await VotingInstance.addVoter(_voter3 , {from: _owner});
          await VotingInstance.startProposalsRegistering({from: _owner});
          await VotingInstance.addProposal(_proposal1, {from: _voter1});
          await VotingInstance.addProposal(_proposal2, {from: _voter2});
        });

        it("should revert if previous workflow not started yet ", async () => {
          await expectRevert(VotingInstance.startVotingSession({from: _owner}),"Registering proposals phase is not finished");
        });

        it("only owner can change workflow ", async () => {  
          await VotingInstance.endProposalsRegistering({from: _owner});
          await expectRevert(VotingInstance.startVotingSession({from: _voter1}),"Ownable: caller is not the owner");  
        });

        it("should emit event WorkflowStatusChange", async () => {
          await VotingInstance.endProposalsRegistering({from: _owner});
          expectEvent(await VotingInstance.startVotingSession({from: _owner}), "WorkflowStatusChange", {previousStatus: new BN(2), newStatus: new BN(3)});
        });
      });

      describe("Workflow End Voting Session", function () {
        beforeEach(async function () {
          await VotingInstance.addVoter(_voter1 , {from: _owner});
          await VotingInstance.addVoter(_voter2 , {from: _owner});
          await VotingInstance.addVoter(_voter3 , {from: _owner});
          await VotingInstance.startProposalsRegistering({from: _owner});
          await VotingInstance.addProposal(_proposal1, {from: _voter1});
          await VotingInstance.addProposal(_proposal2, {from: _voter2});
          await VotingInstance.endProposalsRegistering({from: _owner});
        });

        it("should revert if previous workflow not started yet ", async () => {
          await expectRevert(VotingInstance.endVotingSession({from: _owner}),"Voting session havent started yet");
        });

        it("should emit event WorkflowStatusChange", async () => {
          await VotingInstance.startVotingSession({from: _owner});
          expectEvent(await VotingInstance.endVotingSession({from: _owner}), "WorkflowStatusChange", {previousStatus: new BN(3), newStatus: new BN(4)});
        });

        it("only owner can change workflow ", async () => {  
          await VotingInstance.startVotingSession({from: _owner});
          await expectRevert(VotingInstance.endVotingSession({from: _voter1}),"Ownable: caller is not the owner");  
        });
      });

      describe("Tallied Vote", function () {

        beforeEach(async function () {
          await VotingInstance.addVoter(_voter1 , {from: _owner});
          await VotingInstance.addVoter(_voter2 , {from: _owner});
          await VotingInstance.addVoter(_voter3 , {from: _owner});
          await VotingInstance.startProposalsRegistering({from: _owner});
          await VotingInstance.addProposal(_proposal1, {from: _voter1});
          await VotingInstance.addProposal(_proposal2, {from: _voter2});
          await VotingInstance.addProposal(_proposal3, {from: _voter3});
          await VotingInstance.endProposalsRegistering({from: _owner});
          await VotingInstance.startVotingSession({from: _owner});
          await VotingInstance.setVote(BN(1), {from: _voter1});
          await VotingInstance.setVote(BN(1), {from: _voter2});
          await VotingInstance.setVote(BN(2), {from: _voter3});
        });
  
        it("only owner can tally vote ", async () => {  
          await VotingInstance.endVotingSession({from: _owner});
          await expectRevert(VotingInstance.tallyVotes({from: _voter1}),"Ownable: caller is not the owner");  
        });
  
        it("should revert if previous workflow not started yet", async () => {  
          await expectRevert(VotingInstance.tallyVotes({from: _owner}),"Current status is not voting session ended");
        });
  
        it("should emit event WorkflowStatusChange", async () => {
          await VotingInstance.endVotingSession({from: _owner});
          expectEvent(await VotingInstance.tallyVotes({from: _owner}), "WorkflowStatusChange",   {previousStatus: new BN(4), newStatus: new BN(5)});
        });
      });
    });

    describe("Voter Registration", function () {

      it("add a voter", async () => {  
        await VotingInstance.addVoter(_voter1, {from: _owner} );
        const voter = await VotingInstance.getVoter(_voter1, {from: _voter1} );
        expect(voter.isRegistered).to.be.true;  
      });

      it("only owner can add a voter", async () => {  
        await expectRevert(VotingInstance.addVoter(_voter1, {from: _voter1}),"Ownable: caller is not the owner");
      });

      it("revert on WorkflowStatus ProposalsRegistrationStarted", async () => {  
        await VotingInstance.startProposalsRegistering({from: _owner});
        await expectRevert(VotingInstance.addVoter(_voter1, {from: _owner}),"Voters registration is not open yet");
      });
        
      it("revert when voter is already registered ", async () => {
        await VotingInstance.addVoter(_voter1,{from: _owner});
        await expectRevert(VotingInstance.addVoter(_voter1, {from: _owner}),"Already registered");
      });

      it("should emit event VoterRegistered", async () => {
        expectEvent(await VotingInstance.addVoter(_voter1, { from: _owner }), "VoterRegistered", { voterAddress: _voter1 })
      });

    });

    describe("Proposal Registration", function () {

      beforeEach(async function () {
        await VotingInstance.addVoter(_voter1 , {from: _owner});
        await VotingInstance.addVoter(_voter2 , {from: _owner});
        await VotingInstance.addVoter(_voter3 , {from: _owner});
        await VotingInstance.startProposalsRegistering({from: _owner});
      });

      it("add a registration", async () => {  
        await VotingInstance.addProposal(_proposal1, {from: _voter1} );
        const proposal = await VotingInstance.getOneProposal(BN(1) , {from: _voter1} );
        expect(proposal.description).to.be.eql(_proposal1);  
      });

      it("only registered voter can add a registration", async () => {  
        await expectRevert(VotingInstance.addProposal(_proposal1, {from: _notavoter}),"You're not a voter");
      });

      it("revert on WorkflowStatus endProposalsRegistering", async () => {  
        await VotingInstance.endProposalsRegistering({from: _owner});
        await expectRevert(VotingInstance.addProposal(_proposal2, {from: _voter2}),"Proposals are not allowed yet");
      });
        
      it("revert when proposition is empty ", async () => {
        await expectRevert(VotingInstance.addProposal("", {from: _voter1}),"Vous ne pouvez pas ne rien proposer");
      });

      it("should emit event ProposalRegistered", async () => {
        expectEvent(await VotingInstance.addProposal(_proposal1, {from: _voter1} ), "ProposalRegistered", { proposalId: BN(1) })
      });

    });

    describe("Voting Session", function () {

      beforeEach(async function () {
        await VotingInstance.addVoter(_voter1 , {from: _owner});
        await VotingInstance.addVoter(_voter2 , {from: _owner});
        await VotingInstance.addVoter(_voter3 , {from: _owner});
        await VotingInstance.startProposalsRegistering({from: _owner});
        await VotingInstance.addProposal(_proposal1, {from: _voter1});
        await VotingInstance.addProposal(_proposal2, {from: _voter2});
        await VotingInstance.addProposal(_proposal3, {from: _voter3});
        await VotingInstance.endProposalsRegistering({from: _owner});
        await VotingInstance.startVotingSession({from: _owner});
      });

      it("vote for a proposal", async () => {  
        await VotingInstance.setVote(BN(1), {from: _voter1} );
        const proposal = await VotingInstance.getOneProposal(BN(1) , {from: _voter1});
        expect(BN(proposal.voteCount)).to.be.bignumber.eql(BN(1));  
      });

      it("add multiple votes for a proposal", async () => {  
        await VotingInstance.setVote(BN(1), {from: _voter1} );
        await VotingInstance.setVote(BN(1), {from: _voter2} );
        const proposal = await VotingInstance.getOneProposal(BN(1) , {from: _voter1});
        expect(BN(proposal.voteCount)).to.be.bignumber.eql(BN(2));  
      });

      it("set voter to has voted", async () => {  
        await VotingInstance.setVote(BN(1), {from: _voter1} );
        const voter = await VotingInstance.getVoter(_voter1, {from: _voter1} );
        expect(voter.isRegistered).to.be.true;   
      }); 

      it("only registered voter can add vote", async () => {  
        await expectRevert(VotingInstance.setVote(BN(1), {from: _notavoter}),"You're not a voter");
      });

      it("can only vote once", async () => {  
        await VotingInstance.setVote(BN(), {from: _voter1} );
        await expectRevert(VotingInstance.setVote(BN(1), {from: _voter1} ),"You have already voted");
      });

      it("revert on WorkflowStatus endVotingSession", async () => {  
        await VotingInstance.endVotingSession({from: _owner});
        await expectRevert(VotingInstance.setVote(BN(1), {from: _voter1}),"Voting session havent started yet");
      });
        
      it("revert when proposition doesnt exist ", async () => {
        await expectRevert(VotingInstance.setVote(BN(6), {from: _voter1}),"Proposal not found");
      });

      it("should emit event Voted", async () => {
        expectEvent(await VotingInstance.setVote(BN(1), {from: _voter1}), "Voted", { voter: _voter1 , proposalId: BN(1) })
      });
    });
  });
});