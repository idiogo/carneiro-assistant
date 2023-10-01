const fs = require('fs');
const { fileURLToPath } = require('url');

class DCJournal {

    async insert(database, line, completion = ()=>{}){
      const fs = require('fs');

      this.readOrCreateFile(database, (data) => {
        var fileContent = data;
        fileContent += line + "\n";

        fs.writeFile("conversations/" + database, fileContent, function(err) {
          completion();
        }); 
      });
    }

    readOrCreateFile(fileName, completion) {
      fs.readFile("conversations/" + fileName, function (err, data) {
        if (err){
          fs.writeFile("conversations/" + fileName, "", function(err) {
            if(err) {
                return console.log(err);
            }
            completion("");
          }); 
        }else{
          data = data.toString("utf-8");
          completion(data);
        }
      });
    }

}

module.exports = DCJournal;