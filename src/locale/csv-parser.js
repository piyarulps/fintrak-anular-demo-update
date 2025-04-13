const parser = require("csv-parse");
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './src/locale/translated.csv',
  header: [
    {id: 'french', title: 'French'},
    {id: 'english', title: 'English'}
  ],
  encoding: 'utf-8'
});
// initialize a map
const dictionary = {};
const translations = [];
let allLabels = [];
const frenchFile = './src/locale/fr-FR.xlf'; 
const sourceFile = './src/locale/messages.en.xlf';
// read dic
function createDictionary(callback = null){
    fs.createReadStream('./src/locale/french-dic.csv',{ encoding: 'utf-8' })
    .pipe(parser())
    .on('data', (row)=>{
      dictionary[row[16]] = row[17];
    })
    .on('close',()=>{
        console.log(dictionary);
        console.log('done');
        if(callback){
            callback();
        }
    });
}



function getToTranslate() {
    fs.createReadStream('./src/locale/to-translate-to-french.csv' ,{ encoding: 'utf-8' })
    .pipe(parser())
    .on('data', (row)=>{
        if(typeof dictionary[row[0]] != 'undefined'){
            translations.push({french: dictionary[row[0]], english: row[0] });
        } else{
            translations.push({french: '', english: row[0] });  
        }
    })
    .on('close',()=>{
        console.log(translations);
        csvWriter
  .writeRecords(translations)
  .then(()=> console.log('The CSV file was written successfully'));
    }); 
}

function tranlsate(records){
    records.forEach((row, index)=>{
        if(typeof dictionary[row] != 'undefined'){
            translations.push({french: dictionary[row], english: row  });
        } else{
            translations.push({french: '', english: row  });  
        }
    });
    csvWriter.writeRecords(translations)
  .then(()=> console.log('The CSV file was written successfully'));
  
}

function extractEnglishWords(){
    fs.readFile('./src/locale/messages.en.xlf', 'utf-8', (err, currdata) =>{
        if (err) throw err;
        data = currdata;
        const words = getWords(currdata);
      //  tranlsate(words);
      
        
    });
}
function getWords(_string){
    let  match = _string.match(/<source>[A-Za-z\s.:\-\/]+<\/source>/gm);
    console.log(match);

    let obj = {};

    const matchLen = match.length;
    console.log('matchLen '+ matchLen);
    for(let i = 0; i <  matchLen; i++) {
        let currItem = match[i];
       
        let label =  currItem.replace('<source>','').replace('</source>','').trim();
        allLabels.push(label);  
    }
    console.log(allLabels);
    return allLabels;
  
}
function createFile(data){
    fs.appendFile(frenchFile, data, function (err) {
             if (err) {
                 // append failed
             } else {
                 // done
                 console.log("file created");
             }
         })
 }

 function findAndReplaceWithFrench(_data,_dictionaries){
    for (const [key, value] of Object.entries(_dictionaries)) {
       _data =  _data.replace(key,value);
      }
      return _data;
}
 

function createTranslationFile(){
       fs.readFile(sourceFile, 'utf-8', (err, currdata) =>{
        if (err) throw err;
      
        createFile(formatOutPutFile(currdata,dictionary));
        
    });
}
function formatOutPutFile(_string, dictionary){
    let  match = _string.match(/<source>[A-Za-z\s.:\-\/()/’'!\-?&\-\\!%0-9_*,\*\#>]+<\/source>/gm);
    console.log(match);
    const map = {};
    match.forEach((currItem, index)=>{
        let label =  currItem.replace('<source>','').replace('</source>','').trim();
        let translation = `${currItem}\n\t\t\t<target>${dictionary[label]}</target>`
        map[currItem] = translation;
    });

    for(const [key, value] of Object.entries(map)) {
        _string = _string.replace(`${key}`,`${value}`)
    }
    
   
    return _string;
     
}

createDictionary(createTranslationFile);
//extractEnglishWords();
 


