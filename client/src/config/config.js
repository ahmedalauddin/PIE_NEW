/**
 * Project: valueinfinity-mvp
 * File:    /server/config/config.js
 * Created: 2019-02-16 18:02:01
 * Author:  Darrin Tisdale
 * -----
 * Modified: 2019-02-16 21:17:31
 * Editor:   Darrin Tisdale
 */
import convict from "convict";

// read in the environment configuration
require("dotenv").config();

// structure the variables to be read in
const config = convict("./schema.json");

// load the proper config variables, if they are in the json file
const env = config.get("env");
config.loadFile(`./${env}.json`);
config.validate({
  allowed: "strict"
}); // throws error if config does not conform to schema

// export the default
module.exports = config;
