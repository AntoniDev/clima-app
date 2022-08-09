const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }

    async ciudades(lugar = '') {

        try {
            //petición http
            // console.log('ciudad', lugar);
            // const resp = await axios.get('https://reqres.in/api/users?page=2');
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?access_token=pk.asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf&limit=5&language=es');
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1] 
            })); // retornar los lugares

        } catch (error) {
            return [];
        }

    }

    async climaLugar( lat, lon ) {
        try {

            //instance Axios
            const instance = axios.create({
                baseURL: `https://api.openwearthmap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            })
            //resp.data
            const resp = await instance.get();
            const { weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp 
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {
         //TODO: Prevenir duplicados
        if (this.historial.includes( lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,5); //solo 6 primeros

         this.historial.unshift(lugar.toLocaleLowerCase());

         //Grabar en DB
         this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        //Debe existir 
        if ( !fs.existsSync(this.dbPath)) return null;

        // const info .... readFileSync .... path ....{encoding: 'utf-8'}
        const info = fs.readFileSync(this.dbPath, {enconding: 'utf-8'});

        const data = JSON.parse( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;