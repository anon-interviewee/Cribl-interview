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
              <div className="row">
                <div onClick={() => onToggleRow(i)}>&gt;</div>
                <div key={i + "time"}>{new Date(log._time).toISOString()}</div>
                <div key={i + "event"}></div>
              </div>
              <div className="content">
                <pre>{JSON.stringify(log, null, 2)}</pre>
              </div>
            </>
          );
        } else {
          return (
            <div className="row">
              <div onClick={() => onToggleRow(i)}>&gt;</div>
              <div key={i + "time"}>{new Date(log._time).toISOString()}</div>
              <div key={i + "event"}>{JSON.stringify(log)}</div>
            </div>
          );
        }
      })}
    </div>
  );
};
