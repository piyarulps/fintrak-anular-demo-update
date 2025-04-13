fs = require('fs');
const readline = require('readline');
const frWords = [];
let data = "";
let allLabels = [];

// const readInterface = readline.createInterface({
//     input: fs.createReadStream('./fr2.csv'),
//     console: false
// });
// readInterface.on('line', function (line) {
//    if(line && line != '\n') {
//     frWords.push(line);
//    }
    

// });

// readInterface.on('close',()=>{
//    // console.log(frWords);
//     fs.readFile('./messages.en.xlf', 'utf8', (err, currdata) =>{
//     if (err) throw err;
//     data = currdata;
//     const dic = getDictionaries(currdata);
//   //  const translation = findAndReplaceWithFrench(currdata,dic);
//    // createFile(translation);
    
// });
// });


function extractSummary(_string) {
    const match = _string.match(/translate\('(.)+\)/);
    if (match && Array.isArray(match)) {
        return match[0].replace("translate('", "").replace("')", "");
    }
    return '';

}

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
        
       // obj[currItem] = currItem+ '\n\t\t\t\t<target>'+ frWords[i] +'</target>';
        
        
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

function findAndReplaceWithFrench(_data,_dictionaries){
    for (const [key, value] of Object.entries(_dictionaries)) {
       _data =  _data.replace(key,value);
      }
      return _data;
}

function createFile(data){
   fs.appendFile('./fr-FR.xlf', data, function (err) {
            if (err) {
                // append failed
            } else {
                // done
                console.log("file created");
            }
        })
}







fs.readFile('./messages.en.xlf', 'utf8', (err, currdata) =>{
    if (err) throw err;
    data = currdata;
    const dic = getDictionaries(currdata);
  //  const translation = findAndReplaceWithFrench(currdata,dic);
   // createFile(translation);
    
});