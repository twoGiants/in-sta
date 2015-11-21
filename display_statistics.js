// WANT: show data in a table
// + load data from json file
// - add data into table
//  > load date(dd.mm.yy), f, fs in tableRows for each element in json file
//  > add to DOM

$.getJSON('statistics.json', function(json) {
    
    var tableRows = '';
    
    for(i in json.statistics) {
        var date = new Date(parseInt(json.statistics[i].timestamp));
        var mm = date.getMonth();
        var ddmmyy = date.getDate() + '.' + mm + '.' + date.getFullYear();
        var even = '';
        
        if((parseInt(i) + 1) % 2 === 0) even = ' even';
        
        tableRows += '<tr class="data-row' + even + '">\n'
        tableRows += '\t<td>' + ddmmyy + '</td>\n'
        tableRows += '\t<td class="number">' + json.statistics[i].followers + '</td>\n';
        tableRows += '\t<td class="number">' + json.statistics[i].followings + '</td>\n';
        tableRows += '\t<td class="number">...</td>\n';
        tableRows += '</tr>\n';
    }
    
    $('table tr.table-header').after(tableRows);
});