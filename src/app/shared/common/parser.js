fs = require('fs');
const readline = require('readline');
let allLines = [];
let french = [];
const readInterface1 = readline.createInterface({
    input: fs.createReadStream('./log_pt.csv'),
    console: false
});
readInterface1.on('line', function (line) {
    // const text = extractSummary(line);

    if (line) {
        french.push(line);

    }

});
readInterface1.on('close',()=>{
    console.log(french);
    getTranslation();
})

 function getTranslation(){
    const readInterface = readline.createInterface({
        input: fs.createReadStream('./app.menu.component.ts'),
        console: false
    });
    readInterface.on('line', function (line) {
        const text = extractSummary(line);
    
        if (text) {
            allLines.push(text);
    
        }
    
    });
    readInterface.on('close', () => {
    
        const sorted = allLines.sort();
    
        const unique = [...new Set(sorted)];
         unique.forEach((text,index) => {
             text = text.trim();
        //     fs.appendFile('./log.csv', "\n"  + text , function (err) {
        //         if (err) {
        //             // append failed
        //         } else {
        //             // done
        //         }
        //     })
            fs.appendFile('./log_pt.json', "\n" + '"' + text + '":"' + french[index] + '",', function (err) {
                if (err) {
                    // append failed
                } else {
                    // done
                }
            })
        });
    });
 }
function extractSummary(_string) {
    const match = _string.match(/translate\('(.)+\)/);
    if (match && Array.isArray(match)) {
        return match[0].replace("translate('", "").replace("')", "");
    }
    return '';

}
console.log(extractSummary("label: this.menuGuardSrv.translate('Job request Report'), icon: '', routerLink: ['/report/job-request-report'],"));
// fs.readFile('./app.menu.component.ts', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });