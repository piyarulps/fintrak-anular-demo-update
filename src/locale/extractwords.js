fs = require('fs');
const readline = require('readline');
const frWords = [];
let data = "";
let allLabels = [];

fs.readFile('./messages.en.xlf', 'utf8', (err, currdata) =>{
    if (err) throw err;
    data = currdata;
    const dic = getDictionaries(currdata);
 
    
});



function getDictionaries(_string){
    let  match = _string.match(/<source>[^.]+<\/source>/gm);
    console.log(match);

    let obj = {};

    const matchLen = match.length;
    console.log('matchLen '+ matchLen);
    for(let i = 0; i <  matchLen; i++) {
        let currItem = match[i];
       
        let label =  currItem.replace('<source>','').replace('</source>','').trim();
        allLabels.push(label);
        // console.log(label);
        
        obj[currItem] = currItem+ '\n\t\t\t\t<target>'+ frWords[i] +'</target>';
        
        
    }
    // console.log(allLabels.join('\n'));
    fs.appendFile('./words.csv',allLabels.join('\n'),  (err) =>{
        if (err) {
            // append failed
        } else {
            // done
        }
    })
   

        return obj;
}