const assert = require("assert");
const { processBranchList } = require("./branchParser");

function runTest(){
    describe('branch parser', function(){
        it('parses raw branch list into json array', function(){
            var testInput = `d189c249807f86fadc362f297e0abfd692b3dc2e        refs/heads/e2e_integration_test
            73d8eabb844a2e34f02ad746d22486c41992b0af        refs/heads/external_input_ctrl
            156c965f7a9b09f54f5bf61681ec6fd035363264        refs/heads/fix_layout
            ac9f8110a00d78413a8623a60c6bdf7f6ba99591        refs/heads/fp16_test_hardening
            112171c19c8006bc7a16e9512c5a3f2ea8d30c9a        refs/heads/gds_submission
            2cc41f4b46251121a742d390e5c797c96cb391a8        refs/heads/interface_top_dataout
            2e8c11103b9409132fd4559c27d2ac604083e5db        refs/heads/main
    `
            var testOutput = [
                'e2e_integration_test',
                'external_input_ctrl',
                'fix_layout',
                'fp16_test_hardening',
                'gds_submission',
                'interface_top_dataout',
                'main'
            ]
            assert.equal(JSON.stringify(processBranchList(testInput)), JSON.stringify(testOutput));
        })
    })
    
     //testing input equals testoutput
}   

runTest();