const fs = require("fs");
const yargs = require("yargs");
const readline = require("readline");
//npm install yargs --save


function output(filename, c, l, w, numBytes, numLines, numWords)
{
    let str = "";

    if(c) str += numBytes + " ";
    if(l) str += numLines + " ";
    if(w) str += numWords + " ";

    if(filename) output += filename;

    return str;
}
async function ccwc(filename, c, l, w){

    const all = (c && l && w) || (!c && !l && !w);
    c = c || all;
    l = l || all;
    w = w || all;

    let numBytes = 0;
    let numLines = 0;
    let numWords = 0;

    if(filename)
    {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
              console.log(filename + " could not be opened");
              return;
            }

            //both ways work
            //numBytes = Buffer.byteLength(data, "utf8")
            numBytes = new TextEncoder().encode(data).length

            if(c && !l && !w)
            {
                //only need the byte count, don't process every line
                console.log(numBytes + " " + filename);
                return;
            }

            const lines = data.split("\r\n")
            let counter = 0

            //remove "lines" at the end that only consist of the empty string (as opposed to \n)
            for(let i = lines.length - 1; i >=0; i--)
            {
                if(lines[i] !== "")  break;
                counter += 1
            }

            numLines = lines.length;
            //numLines = lines.length - counter;
            for(let i = 0; i<lines.length; i++)
            {
                //don't let empty strings contribute to the word count
                numWords += lines[i].split(" ").filter(ele => ele !== "").length
            }

            console.log(output(filename, c, l, w, numBytes, numLines, numWords));
        });
    }
    else    //via stdin from the terminal
    {
       //alternative that doesn't quite work
       //process.stdin.fd is equal to 0
       //const data = fs.readFileSync(process.stdin.fd).toString();

        const rl = readline.createInterface({ input: process.stdin });
        for await(const line of rl)
        {
            //numBytes += new TextEncoder().encode(line).length
            numBytes += Buffer.byteLength(line, "utf8")
            numLines += 1;
            numWords += line.split(" ").filter(ele => ele !== "").length
        }

        console.log(output(filename, c, l, w, numBytes, numLines, numWords ));
    }
}

const args = yargs.argv
//console.log(args["$0"])     //the js file that is being run

//args["_"] is an array of positional arguments
const filename = args["_"][0]

ccwc(filename, args.c, args.l, args.w)

//place the positional arguments in the front so they aren't mistaken for the value of a flag
//e.g node ccwc.js -a test.txt  (the value of the flag a is test.txt)


/*
//alternative to yargs
//use process.argv

console.log(process.argv[0])            //path to node
console.log(process.argv[1])            //path to this js file
const args = process.argv.slice(2)
const filename = args[0]
*/
