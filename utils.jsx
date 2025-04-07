import * as React from "react";

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
  }
}

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
