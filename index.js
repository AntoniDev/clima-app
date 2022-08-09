require('dotenv').config();


const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

//Variables de entorno
// console.log(process.env.MAPBOX_KEY); //MAPBOX_KEY
// console.log(process.env); //MAPBOX_KEY

const main = async () => {
    const busquedas = new Busquedas()
    let opt = '';

    do {
        opt = await inquirerMenu();
        console.log({ opt })
        switch (opt) {
            case 1:
                //Mostrar mensaje para la que persona escriba
                const lugar = await leerInput('Ciudad: ');
                // Buscar los lugares
                const lugares = await busquedas.ciudades( lugar );
                if ( id === '0') continue;

                
                // Mostrar resultados y Usuario seleccionar el lugar 
                const id = await listarLugares(lugares);
                const lugarSel = lugares.find( lugar => lugar.id === id);
                //Guardar en DB
                busquedas.agregarHistorial( lugar.sel.nombre);
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de  la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Long:', lugarSel.lng);
                console.log('Temperatur:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Descripción:', clima.desc);
            case 2:
               busquedas.historialCapitalizado.forEach( (lugar, i) => {
                const idx = `${ i + 1}.`.green;
                console.log(`${idx} ${lugar}`);
               });
                
                break;
        }
        if (opt !== 0) await pausa();

    } while (opt !== 0);
console.log("Hasta pronto!!")
}

main();