const fs = require("fs");
const yargs = require("yargs")
//npm install yargs --save

function ccwc(filename){

    fs.readFile(filename, "utf8", (err, data) => {
        if (err) {
          console.log(filename + " could not be opened");
          return;
        }

        //both ways work
        //const numBytes = Buffer.byteLength(data, "utf8")
        const numBytes = new TextEncoder().encode(data).length

        //data is readFile's cb's parameter, it is a string
        const lines = data.split("\r\n")
        let counter = 0
        //remove "lines" at the end that only consist of the empty string (as opposed to \n)
        for(let i = lines.length - 1; i >=0; i--)
        {
            if(lines[i] !== "")  break;
            counter += 1
        }
        const numLines = lines.length - counter;

        let numWords = 0
        for(let i = 0; i<lines.length; i++)
        {
            //don't let empty strings contribute to the word count
            const words = lines[i].split(" ").filter(ele => ele !== "")
            numWords += words.length
            //if(words.length == 1) console.log(words)
        }

        console.log(numBytes," bytes")
        console.log(numLines, " lines");
        console.log(numWords, " words");
        console.log(counter, " counter")
    });
}

/*
//using process.argv

console.log(process.argv[0])            //path to node
console.log(process.argv[1])            //path to this js file
const args = process.argv.slice(2)
const filename = args[0]

*/

const args = yargs.argv

//console.log(args["$0"])     //the js file that is being run

//args["_"] is an array of positional arguments (go at the front)
//otherwise can be interpreted as the value of a flag

const filename = args["_"][0]

//if you try to access a flag that was not provided on the command line, undefined
const c = args.c ? args.c : false
const l = args.l ? args.l : false
const w = args.w ? args.w : false

ccwc(filename)
