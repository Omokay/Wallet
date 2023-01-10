import { Knex, knex } from 'knex'
import {KnexConfig} from '../../knexConfig';


const configOptions = process.env.NODE_ENV === 'test' ? KnexConfig.test : KnexConfig.development;
const knexInstance: Knex = knex(configOptions);

// create a knexInstance to the database
knexInstance.raw("SELECT VERSION()").then(() => console.log("Connection Established"));


// close the knexInstance when the application exits
process.on('exit', () => {
    knexInstance.destroy();
    console.log('knexInstance has been destroyed');
});



export {
    knexInstance,
};




