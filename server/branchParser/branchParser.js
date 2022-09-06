
function processBranchList(payload){
    var data = payload.toString();
    console.log('---\n' + data + '\n---');
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


exports.processBranchList = processBranchList;