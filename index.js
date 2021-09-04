document.getElementById("commands").addEventListener("change", getFile);

function getFile(event) {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    placeFileContent(document.getElementById("commands"), input.files[0]);
  }
}

function placeFileContent(target, file) {
  readFileContent(file)
    .then((content) => {
      document.querySelector(".result").innerHTML = "NO";
      const userInput = content.split("\r\n");

      const numberOfDisks = Number(userInput[0]);

      //Gets all commands from userInput except for the first one (numberofDisks)
      const commands = userInput.splice(1, userInput.length);

      //Creates 3 pegs for us to move the discs around based on user input file
      const pegs = [[...Array(numberOfDisks).keys()], [], []];

      console.log(pegs);
      let buffer = [];
      let winable = [true];

      for (let i = 0; i < commands.length; i++) {
        buffer = [];
        buffer = pegs[commands[i][0] - 1].splice(0, 1);
        pegs[commands[i][1] - 1].unshift(buffer[0]);

        //runs a check every loop to see if a bigger disk is stacked on top of a smaller disk - makes current game unwinable if found

        for (let i = 0; i < pegs[0].length; i++) {
          if (pegs[0][i] > pegs[0][i + 1]) {
            document.querySelector(".result").innerHTML = "NO";
            winable = false;
          }
        }

        for (let i = 0; i < pegs[1].length; i++) {
          if (pegs[1][i] > pegs[1][i + 1]) {
            document.querySelector(".result").innerHTML = "NO";
            winable = false;
          }
        }

        for (let i = 0; i < pegs[2].length; i++) {
          if (pegs[2][i] > pegs[2][i + 1]) {
            document.querySelector(".result").innerHTML = "NO";
            winable = false;
          }
        }
        function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

        // Checks each command for invalid characters
        for (let j = 0; j < commands[i].length; j++) {
          if (isNaN(commands[i][j])) {
            document.querySelector(".result").innerHTML = "NO";
            winable = false;
          }
        }
        for (let j = 0; j < commands[i].length; j++) {
          if (!isNumber(commands[i][j])) {
            document.querySelector(".result").innerHTML = "NO";
            winable = false;
          }
        }

        if (toString(commands[i]).includes(NaN)) {
          document.querySelector(".result").innerHTML = "NO";
          winable = false;
        }

        if (isNaN(commands[commands.length - 1])) {
          document.querySelector(".result").innerHTML = "NO";
          winable = false;
        }
        
        if (!isNumber(commands[commands.length - 1])) {
          document.querySelector(".result").innerHTML = "NO";
          winable = false;
        }

        //Disqualifies users who try taking a disk from a peg with no discs on it
        if (
          pegs[0].includes(undefined) ||
          pegs[1].includes(undefined) ||
          pegs[2].includes(undefined)
        ) {
          document.querySelector(".result").innerHTML = "NO";
          winable = false
        }


        //Check for a possible win
        if (
          winable &&
          (pegs[1].length === numberOfDisks || pegs[2].length === numberOfDisks)
        ) {
          document.querySelector(".result").innerHTML = "YES";
        } else if (
          pegs[0].length < numberOfDisks ||
          pegs[1].length < numberOfDisks ||
          pegs[2].length < numberOfDisks
        ) {
          document.querySelector(".result").innerHTML = "NO";
        } 

        console.log("IS winable?" + winable);
      }

      console.log("peg1: " + pegs[0]);
      console.log("peg2: " + pegs[1]);
      console.log("peg3: " + pegs[2]);
    })
    .catch((error) => console.log(error));
}

//allows contents of uploaded file to be read
function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
