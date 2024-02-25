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
        //need a try/catch block for error handling with readFileSync, d.n take a callback
        //const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' } );

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
            numLines = lines.length;

            //remove "lines" at the end that only consist of the empty string (as opposed to \n)
            //let counter = 0
            // for(let i = lines.length - 1; i >=0; i--)
            // {
            //     if(lines[i] !== "")  break;
            //     counter += 1
            // }
            //numLines = lines.length - counter;

            for(let i = 0; i<lines.length; i++)
            {
                //don't let empty strings contribute to the word count
                const words = lines[i].split(" ").filter(ele => ele !== "")
                numWords += words.length
                if(words.length == 1) console.log(lines[i])
            }

            console.log(output(filename, c, l, w, numBytes, numLines, numWords));
        });
    }
    else    //via stdin from the terminal
    {

        //alternative, 0 refers to process.stdin
        //const data = fs.readFileSync(0).toString();

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
const filename = args["_"][0]
const pipe = !process.stdin.isTTY;

if((filename && !pipe) || (!filename && pipe))
ccwc(filename, args.c, args.l, args.w);
else
console.log("Please provide a filename as a positional argument or pipe in a file but not both")
