let fs = require('fs');

const ansi = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      crimson: "\x1b[38m" // Scarlet
  },
  bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      crimson: "\x1b[48m"
  }
};

const writeAfterLineToFile = (filePath, seekLine, text) => {
  let data = fs.readFileSync(filePath).toString().split("\n");
  let index = null;
  data.forEach((line, i) => { if (seekLine === line) index = i })
  if (index) {
    writeLineToFile(filePath, index+1, text);
  } else {
    console.log('failed to insert after line')
  }
}

const writeLineToFile = (filePath, lineNumber, text) => {
  let data = fs.readFileSync(filePath).toString().split("\n");
  data.splice(lineNumber, 0, text);
  fs.writeFileSync(filePath, data.join("\n"), function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('modified file: ', filePath);
    }
  });
}

const deleteLineFromFile = (filePath, seekLine) => {
  let data = fs.readFileSync(filePath).toString().split("\n");
  let index = null;
  data.forEach((line, i) => { if (seekLine === line) index = i });
  if (index) {
    data.splice(index, 1);
    fs.writeFileSync(filePath, data.join("\n"));
  } else {
    console.log('did not find line: ', seekLine);
  }
}

const deleteLinesFromFile = (filePath, seekLine, numLines) => {
  let data = fs.readFileSync(filePath).toString().split("\n");
  let index = null;
  data.forEach((line, i) => { if (seekLine === line) index = i });
  if (index) {
    data.splice(index, numLines);
    fs.writeFileSync(filePath, data.join("\n"));
  } else {
    console.log('did not find line: ', seekLine);
  }
}

const cliHelp = '';
// `

// dev-cli.js help:

// `;

function generateRouteTemplate(routeName) { return `import { RouterResponse } from '../../services/router/router.service';\n\nexport default (request: any): Promise<RouterResponse> => new Promise(res => res({ code: 200, json: { success: true, message: ["${routeName} route works!"]} }));`; }
function generateRouteSchemaTemplate(routeName) { return `export default {}`; }

function generateService(args) {}

let args = process.argv; args.shift(); args.shift(); args = args.map(arg => arg.toLowerCase()); 


const scriptMap = {
  key: null,
  exec: () => args.length ?
    console.log(ansi.bg.red, `Error: command '${args[0]}' not supported.`, ansi.reset) :
    console.log(ansi.bg.blue, `type 'node dev-cli.js help' for instructions.`, ansi.reset),
  children: [
    {
      key: /^(\?|help)$/,
      exec: () => console.log(cliHelp),
      children: [
        {
          key: /^(r|route)$/,
          exec: () => console.log(`ROUTE HELP PLACEHOLDER`),
          children: null
        },
        {
          key: /^(s|service)$/,
          exec: () => console.log(`SERVICE HELP PLACEHOLDER`),
          children: null
        },
      ]
    },
    {
      key: /^(g|generate)$/,
      exec: (args) => args.length ?
          console.log(ansi.bg.red, `Error: Element '${args[0]}' not supported.`, ansi.reset) :
          console.log(`Please specify a valid element type and name to generate.`),
      children: [
        {
          key: /^(r|route)$/,
          exec: (args) => {
            if (args.length) {
              const routeName = args[0].split('/').pop();
              const pathName = '/' + args[0].split('/').slice(0, -1).join('/');
              if (fs.existsSync(`./server/routes/${args[0]+'/'+routeName}.route.ts}`)) {
                console.log(ansi.bg.red, `Could not create Route ${args[0]} because it already exists.`, ansi.reset);
              } else {
                console.log(`Generating Route ${args[0]} ...`);
                fs.mkdirSync(`./server/routes/${args[0]}`, {recursive: true});
                console.log(ansi.fg.green, `Directory ./server/routes/${args[0]} created.`, ansi.reset);
                fs.writeFileSync(`./server/routes/${args[0]+'/'+routeName}.route.ts`, generateRouteTemplate(routeName));
                console.log(ansi.fg.green, `./server/routes/${args[0]+'/'+routeName}.route.ts created.`, ansi.reset);
                fs.writeFileSync(`./server/routes/${args[0]+'/'+routeName}.schema.ts`, generateRouteSchemaTemplate(routeName));
                console.log(ansi.fg.green, `./server/routes/${args[0]+'/'+routeName}.schema.ts created.`, ansi.reset);
                writeLineToFile(`./server/routes/routes.ts`, 0, `import ${args[0].split('/').join('_')}Route from './${args[0]+'/'+routeName}.route';\nimport ${args[0].split('/').join('_')}Schema from './${args[0]+'/'+routeName}.schema';`);
                writeAfterLineToFile(`./server/routes/routes.ts`, `const routes: { [key: string]: Route } = {`, ` ${routeName}: {
    method: ${args.length > 1 ? JSON.stringify([args[1].toUpperCase()]) : "['GET']"},
    contentType: "${args.length > 2 ? args[2] : "application/json"}",
    privilege: ${args.length > 3 ? JSON.stringify(args.slice(3, args.length)) : "['guest']"},
    schema: ${args[0].split('/').join('_')}Schema,
    route: ${args[0].split('/').join('_')}Route 
  },`);
                console.log(`File ./server/routes/routes.ts modified.`);
              }
            } else { console.log(ansi.bg.yellow, `Please specify name of Route to generate.`, ansi.reset); }
          },
          children: []
        },
        {
          key: /^(s|service)$/,
          exec: (args) => {
            if (args.length) {
              if (fs.existsSync(`./server/services/${args[0]}/${args[0]}.service.ts`)) {
                console.log(ansi.bg.red, `Could not create Service ${args[0]} because it already exists.`, ansi.reset);
              } else {
                console.log(`Generating Service ${args[0]} ...`);
                fs.mkdirSync(`./server/services/${args[0]}`);
                console.log(ansi.fg.green, `Directory ./server/services/${args[0]} created.`, ansi.reset);
                fs.writeFileSync(`./server/services/${args[0]}/${args[0]}.service.ts`, `const ${args[0]} = () => null\n\nexport default ${args[0]};`);
                console.log(ansi.fg.green, `./server/services/${args[0]}/${args[0]}.service.ts created.`, ansi.reset);
                writeLineToFile(`./server/services/services.ts`, 0, `import ${args[0]} from './${args[0]+"/"+args[0]+".service"}';`);
                writeAfterLineToFile(`./server/services/services.ts`, `const services = {`, `  ${args[0]}: ${args[0]},`);
              }
            } else { console.log(ansi.bg.yellow, `Please specify name of Service to generate.`, ansi.reset); }
          },
          children: []
        }
      ]
    },
    {
      key: /^(d|delete)$/,
      exec: (args) => console.log(`Delete not yet implemented.`),
      children: [
        {
          key: /^(r|route)$/,
          exec: (args) => {
            if (args.length) {
              const routeName = args[0].split('/').pop();
              deleteLineFromFile(`./server/routes/routes.ts`, `import ${args[0].split('/').join('_')}Route from './${args[0]+'/'+routeName}.route';`);
              deleteLineFromFile(`./server/routes/routes.ts`, `import ${args[0].split('/').join('_')}Schema from './${args[0]+'/'+routeName}.schema';`);
              deleteLinesFromFile(`./server/routes/routes.ts`, ` ${routeName}: {`, 6);
              console.log(`File ./server/routes/routes.ts modified.`);
              fs.rmSync(`./server/routes/${args[0]}`, {recursive: true, force: true});
              console.log(`Directory ./server/routes/${args[0]} removed.`);
              console.log(ansi.fg.green, `Route ${args[0]} successfully removed!`, ansi.reset);
            } else {
              console.log(`You must provide route name to delete.`);
            }
          },
          children: []
        },
        {
          key: /^(s|service)$/,
          exec: (args) => {
            if (args.length) {
              deleteLineFromFile(`./server/services/services.ts`, `import ${args[0]} from './${args[0]+"/"+args[0]+".service"}';`);
              deleteLineFromFile(`./server/services/services.ts`, `  ${args[0]}: ${args[0]},`);
              console.log(`File ./server/services/services.ts modified.`);
              fs.rmSync(`./server/services/${args[0]}`, {recursive: true, force: true});
              console.log(`Directory ./server/services/${args[0]} removed.`);
              console.log(ansi.fg.green, `Service ${args[0]} successfully removed!`, ansi.reset);
            } else { console.log(`You must specify a service name for deletion.`); }
          },
          children: []
        }
      ]
    }
  ]
};

function traverse(args, node) {
  if (node.children) {
    let match = null;
    node.children.forEach(cNode => {
      if (cNode.key.test(args[0])) {
        match = cNode;
      }
    });
    if (match) {
      args.shift();
      traverse(args, match);
    } else {
      node.exec(args);
    }
  } else {
    node.exec(args);
  }
}

console.log(ansi.bg.green, `*************** dev-cli ***************`, ansi.reset);
console.log();

traverse(args, scriptMap);

console.log();
console.log(ansi.bg.green, `*************** dev-cli terminated ***************`, ansi.reset);