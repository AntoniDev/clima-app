const { leerInput } = require('./helpers/inquirer');

const main = async() => {
    const text = await leerInput("Hola: ");
    console.log(text);
}

main();