#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const yargs = require("yargs");
let execDir = process.cwd();

const options = yargs.usage("Usage: $0 -s <substring>").option({
  substring: {
    alias: "s",
    describe: "Substring to search in files",
    type: "string",
    demandOption: false,
  },
  regexp: {
    alias: "r",
    describe: "Regexp pattern to search in files",
    type: "string",
  },
  flags: {
    alias: "f",
    describe: "Regexp flags",
    type: "string",
  },
}).argv;

const isFile = (fileName) => fs.lstatSync(fileName).isFile();

let list = fs.readdirSync(execDir);
const initialQuestions = [
  {
    name: "fileName",
    type: "list",
    message: "Choose file:",
    choices: list,
  },
];

const ask = (questions) => {
  inquirer
    .prompt(questions)
    .then((answers) => {
      const filePath = path.resolve(execDir, answers.fileName);
      if (isFile(filePath)) {
        fs.readFile(filePath, "utf8", (err, data) => {
          // console.log(options.substring);
          if (options.substring) {
            console.log(
              data
                .split(/r?\n/)
                .filter((line) => line.includes(options.substring))
                .join("\n")
            );
          } else if (options.regexp) {
            //do regexp stuff
            const regexp = new RegExp(options.regexp, options.flags);
            console.log(regexp);
            console.log(
              data
                .split(/r?\n/)
                .filter((line) => {
                  return line.search(regexp) !== -1;
                })
                .join("\n")
            );
          } else {
            console.log(data);
          }
        });
      } else {
        execDir = path.resolve(execDir, answers.fileName);
        list = fs.readdirSync(execDir);
        initialQuestions[0].choices = list;
        ask(initialQuestions);
      }
    })
    .catch((err) => console.log(err));
};

ask(initialQuestions);