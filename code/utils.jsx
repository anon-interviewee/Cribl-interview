import * as React from "react";

/**
 * Retrieves a Newline delimited JSON file from a URL and streams it to a callback
 * @param {*} url 
 * @param {*} callback a function that receives an array of json objects
 */
export async function fetchLogs(url, callback) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const stream = response.body.pipeThrough(new TextDecoderStream());
  let buffer = "";

  for await (const stringChunk of stream) {
    const result = [];
    buffer += stringChunk;

    for (var i = 0, last = 0; i < buffer.length; i++) {
      if (buffer[i] === "\n") {
        const line = buffer.substring(last, i);
        last = i + 1;
        result.push(JSON.parse(line));
      }
    }

    buffer = buffer.substring(last);
    callback(result);

    console.log(result.length);
  }
}

/**
 * Converts a JSON object into a set of React elements that displays it in a human readable format.
 * It is a recursive function, so the initial caller should generally only pass in the json object.
 * @param {*} json 
 * @param {*} indent 
 * @param {*} index 
 * @returns 
 */
export const prettyPrint = (json, indent = 2, index = 0) => {
  if (Array.isArray(json)) {
    return [
      "[\n",
      ...json
        .map((item, i) => (
          <React.Fragment key={"item-" + i}>
            {"".padStart(indent, " ")}
            {prettyPrint(item, indent + 2)}
          </React.Fragment>
        ))
        .reduce(
          (prev, curr) => (prev === null ? [curr] : [prev, ",\n", curr]),
          null
        ),
      "\n",
      "".padEnd(indent - 2, " "),
      "]",
    ];
  } else if (typeof json === "object") {
    return [
      "{\n",
      ...Object.keys(json)
        .map((key, i) => (
          <React.Fragment key={"key-" + i}>
            {"".padStart(indent, " ")}
            <span key={"key-" + i} className="key">
              "{key}"
            </span>
            : {prettyPrint(json[key], indent + 2, i)}
          </React.Fragment>
        ))
        .reduce(
          (prev, curr) => (prev === null ? [curr] : [prev, ",\n", curr]),
          null
        ),
      "\n",
      "".padEnd(indent - 2, " "),
      "}",
    ];
  } else {
    return (
      <span key={"value-" + index} className={typeof json}>
        {typeof json === "string"
          ? `"${json.replaceAll("\n", "\\n")}"`
          : String(json)}
      </span>
    );
  }
};
