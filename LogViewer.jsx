import * as React from "react";

async function fetchLogs(url, callback) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const stream = response.body.pipeThrough(new TextDecoderStream());

  let complete = false;
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

export const LogViewer = () => {
  const [logs, setLogs] = React.useState([]);
  const [openRows, setOpenRows] = React.useState(new Set());

  const onToggleRow = (index) => {
    if (openRows.has(index)) {
      openRows.delete(index);
      setOpenRows(new Set(openRows));
    } else {
      openRows.add(index);
      setOpenRows(new Set(openRows));
    }
  };

  const onLines = React.useCallback((lines) => {
    setLogs(logs.concat(lines));
  }, []);

  React.useEffect(() => {
    fetchLogs(
      "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log",
      onLines
    );
  }, []);

  const prettyPrint = (json, indent = 2) => {
    if (Array.isArray(json)) {
      return <>
        {"[\n"}
        {json.map((item) => <>
          {"".padStart(indent, " ")}
          {prettyPrint(item, indent + 2)}
        </>).reduce((prev, curr) => prev === null ? [curr] : [prev, ',\n', curr], null)}
        {"\n" + "".padEnd(indent - 2, " ") + "]"}
      </>;
    } else if (typeof json === "object") {
      return <>{"{\n"}
        {Object.keys(json).map((key) => <>
          {"".padStart(indent, " ")}
          <span className="key">"{key}"</span>: {prettyPrint(json[key], indent + 2)}
          {"\n"}
        </>)}
        {"".padStart(indent - 2, " ") + "}"}</>;
    } else {
      return <span className={typeof json}>{typeof json === "string" ? `"${json.replaceAll("\n", "\\n")}"` : json}</span>
    }
  };

  return (
    <div className="grid">
      <div className="header">
        <div></div>
        <div>Time</div>
        <div>Event</div>
      </div>
      
      {logs.map((log, i) => {
        if (openRows.has(i)) {
          return (
            <>
              <div className="row no-border">
                <div className="caret" onClick={() => onToggleRow(i)}><span className="open">&gt;</span></div>
                <div key={i + "time"}>{new Date(log._time).toISOString()}</div>
                <div key={i + "event"}></div>
              </div>
              {/* p tag here to avoid reseting the nth-of-type count */}
              <p className="content">
                <pre>{prettyPrint(log)}</pre>
              </p>
            </>
          );
        } else {
          return (
            <div className="row">
              <div className="caret" onClick={() => onToggleRow(i)}>&gt;</div>
              <div key={i + "time"}>{new Date(log._time).toISOString()}</div>
              <div key={i + "event"}>{JSON.stringify(log)}</div>
            </div>
          );
        }
      })}
    </div>
  );
};
