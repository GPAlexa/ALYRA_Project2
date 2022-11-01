ALYRA • Project 2 
=======

## Unit Testing on Voting Project ##
 

___

### Total ###

<br> 
33 passing test
<br>

____

### Test Structure ###
<br>

Complete test

1. Workflow


    + Workflow Proposals Registering <br>
          &check; should emit event WorkflowStatusChange (95102 gas)<br>
          &check; only owner can change workflow <br>
          &check; should create Genesis proposal (95102 gas) <br> <br>
    + Workflow End Proposals Registering <br>
          &check; should revert if previous workflow not started yet  <br>
          &check; only owner can change workflow (95102 gas) <br>
          &check; should emit event WorkflowStatusChange (244286 gas) <br> <br>
    + Workflow Start Voting Session <br>
          &check; should revert if previous workflow not started yet  <br>
          &check; only owner can change workflow (30604 gas) <br>
          &check; should emit event WorkflowStatusChange (61163 gas) <br> <br>
    + Workflow End Voting Session <br>
          &check; should revert if previous workflow not started yet <br>
          &check; should emit event WorkflowStatusChange (61097 gas) <br>
          &check; only owner can change workflow  (30559 gas) <br> <br>
    + Tallied Vote <br>
          &check; only owner can tally vote (30538 gas) <br>
          &check; should revert if previous workflow not started yet <br>
          &check; should emit event WorkflowStatusChange (97012 gas) <br> <br>

2. Voter Registration <br>
        &check; add a voter (50225 gas) <br>
        &check; only owner can add a voter <br>
        &check; revert on WorkflowStatus ProposalsRegistrationStarted (95102 gas) <br>
        &check; revert when voter is already registered (50225 gas) <br>
        &check; should emit event VoterRegistered (50225 gas) <br>

3. Proposal Registration <br>
        &check; add a registration (59290 gas) <br>
        &check; only registered voter can add a registration <br>
        &check; revert on WorkflowStatus endProposalsRegistering (30604 gas) <br>
        &check; revert when proposition is empty <br>
        &check; should emit event ProposalRegistered (59290 gas) <br>

4. Voting Session <br>
        &check; vote for a proposal (78018 gas) <br>
        &check; add multiple votes for a proposal (138936 gas) <br>
        &check; set voter to has voted (78018 gas) <br>
        &check; only registered voter can add vote <br>
        &check; can only vote once (58106 gas) <br>
        &check; revert on WorkflowStatus endVotingSession (30538 gas) <br>
        &check; revert when proposition doesnt exist <br>
        &check; should emit event Voted (78018 gas) <br>

<br>

____

### Gas Consumption ###
<br>
<br>

|Solc version: 0.8.17+commit.8df45f5f||Optimizer enabled: false||Runs: 200|Block limit: 6718946 gas||
|---|---|---|---|---|---|---|
|Methods||21 gwei/gas|||1602.32 eur/eth||
|Contract|Method|Min|Max|Avg|#calls|eur (avg)|
|Voting|addProposal|-|-|59290|52|2.00|
|Voting|addVoter|-|-|50225|92|1.69|
|Voting|endProposalsRegistering|-|-|30604|22| 1.03|
|Voting|endVotingSession|-|-|30538|7|1.03|  
|Voting|setVote|58106|78018|71752|20|2.41|
|Voting|startProposalsRegistering|-|-|95102|33| 3.20|
|Voting|startVotingSession|-|-|30559|18| 1.03|
|Voting|tallyVotes|-|-|66474| 2| 2.24|
|Deployments|||||% of limit||
|Voting||-|-|2084815|31 %|70.15|
