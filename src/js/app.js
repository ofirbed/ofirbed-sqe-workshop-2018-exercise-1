import $ from 'jquery';
import {getElementbyNumber, parseCode} from './code-analyzer';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        var codeToParse = $('#codePlaceholder').val();
        let array_to_display = parseCode(codeToParse);
        DisplayTable(array_to_display);
        // $('#parsedCode').val(JSON.stringify(array_to_display, null, 2));
    });
});

function convertUndefinedToEmptyString (str){
    if (str === undefined) return '';
    return str;
}


function DisplayTable(elementsArr) {
    //var div1 = document.getElementById('div1');
    var tbl = document.getElementById('output_table');


    for (var r = 0; r < elementsArr.length; r++) {
        var row = document.createElement('tr');

        for (var c = 0; c < 5; c++) {
            var cell = document.createElement('td');
            cell.className = 'output';
            var cellText = document.createTextNode(convertUndefinedToEmptyString(getElementbyNumber(elementsArr[r],c+1)));
            cell.appendChild(cellText);
            row.appendChild(cell);}

        tbl.appendChild(row);}


    // var paragraph = document.createElement("p");
    // var linebreak = document.createElement("br");
    //     do{
    //     while(char !='\n''){
    //         text=text.append(char);
    //         char.next();
    //         }
    //         lineText = document.createTextNode(text)
    //         paragraph.appendChild(lineText);
    //         paragraph.appendChild(linebreak)
    //
    //     }while(char == null);

    // div1.appendChild(tbl);
}

