const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "Title",
      message: " Whats your project Name?",
    },
    {
      type: "input",
      name: "Description",
      message: " What does your project/application exactly do?",
    },
    {
      type: "input",
      name: "Usage",
      message: " How do you use this application?",
    },
    {
      type: "input",
      name: "Install",
      message: " How do you install your project ?",
    },
    {
      type: "list",
      choices: [
        "MIT",
        "The Unlicense",
        "GPL",
        "Apache",
        "BSD",
        "IMAKEMYOWNLICENSE",
      ],
      name: "License",
      message: " Any license for your project?",
    },
    {
      type: "input",
      name: "Contributions",
      message: " How to Fund this project?",
    },
    {
      type: "input",
      name: "Tests",
      message: " Are you wrting any tests for this project?",
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username please",
      validate: async function (input, answers) {
        const queryUrl = `https://api.github.com/users/${input}`;

        try {
          await axios.get(queryUrl);
          return true;
        } catch {
          return "sorry user not found";
        }
      },
    },
    {
      type: "input",
      name: "email",
      message: "what is your email address?",
    },
  ]);
}

async function generateReadme(answers) {
  let usage = "";
  if (answers.Usage !== "") {
    usage = `## Usage
        \r${answers.Usage}`;
  }

  let title = "";
  if (answers.Title !== "") {
    title = `# ${answers.Title}`;
  }

  let description = "";
  if (answers.Description !== "") {
    description = `## Description
        \r${answers.Description}`;
  }

  let installation = "";
  if (answers.Installation !== "") {
    installation = `## Installation 
        \r${answers.Installation}`;
  }

  let license = "";
  if (answers.License !== "") {
    license = `## License
        \r${answers.License}`;
  }

  let Contributions = "";
  if (answers.Contributions !== "") {
    Contributions = `## Contributions
        \r${answers.Contributions}`;
  }

  let tests = "";
  if (answers.Tests !== "") {
    tests = `## Tests
        \r${answers.Tests}`;
  }

  let questions = "";
  const queryUrl = `https://api.github.com/users/${answers.github}`;
  const avatar = await axios.get(queryUrl).then(function (res) {
    return res.data.avatar_url;
  });

  if (answers.github !== "") {
    questions = `


    ## Questions
![avatar](${avatar})

Reach out with any questions !
[${answers.github}](https://github.com/${answers.github}) 
directly at ${answers.email}.
        `;
  }

  return `
${title}
[![GitHub license](https://img.shields.io/badge/license-${encodeURIComponent(
    answers.License
  )}-blue.svg)](https://github.com/${answers.github})

${description}
## Table of contents
${installation !== "" ? "* [Installation](#installation)" : ""}
${usage !== "" ? "* [Usage](#usage)" : ""}
${license !== "" ? "* [License](#license)" : ""}
${Contributions !== "" ? `* [Contributions](#Contributions)` : ""}
${tests !== "" ? "* [Tests](#Tests)" : ""}

${installation}
${usage}
${license}
${Contributions}
${tests}
${questions}
    `;
}

promptUser()
  .then(async function (answers) {
    const md = await generateReadme(answers);

    return writeFileAsync("newReadme.md", md);
  })
  .then(function () {
    console.log("Congrats!! you just wrote to newReadme.md");
  })
  .catch(function (err) {
    console.log(err);
  });
