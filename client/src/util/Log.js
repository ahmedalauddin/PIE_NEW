/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/util/Log.js
 * Created:  2019-03-05 14:53:32
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-08 11:10:27
 * Editor:   Darrin Tisdale
 */

import debug from "debug";

const BASE = "valueinfinity-mvp-client";
const COLORS = {
  trace: "lightblue",
  info: "blue",
  warn: "orange",
  error: "red"
};

class Log {
  generateMessage(level, message, meta, source) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace);

    // Set the colour of the message based on the level
    createDebug.color = COLORS[level];

    if (source) {
      createDebug(source, message);
    } else {
      createDebug(message);
    }
  }

  trace(message, source) {
    return this.generateMessage("trace", message, source);
  }

  info(message, source) {
    return this.generateMessage("info", message, source);
  }

  warn(message, source) {
    return this.generateMessage("warn", message, source);
  }

  error(message, source) {
    return this.generateMessage("error", message, source);
  }
}

export default new Log();
