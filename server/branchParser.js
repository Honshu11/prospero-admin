const { assert } = require("console");

function processBranchList(payload){
    var data = payload.toString();
    console.log(data);
    var branchEntries = data.split('\n');
    branchEntries = branchEntries.slice(0, branchEntries.length - 1);
    console.log('branchEntries: ', branchEntries);
    var branches = branchEntries.map(function(entry){
        var parts = entry.split('/');
        console.log('entry: ', entry);
        return parts[parts.length -1];
         //picking out last item in array list.
    })
    return branches; 
}

function runTest(){
    //var testInput = 
    var testOutput = [
        'e2e_integration_test',
        'external_input_ctrl',
        'fix_layout',
        'fp16_test_hardening',
        'gds_submission',
        'interface_top_dataout',
        'main'
      ]
    // assert processBranchList()
}

exports.processBranchList = processBranchList;