import * as React from "react";
import { fetchLogs, prettyPrint, useChunked } from "./utils.jsx";

const CHUNK_SIZE = 1000;

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
    setLogs((prev) => prev.concat(lines));
  }, []);

  React.useEffect(() => {
    fetchLogs(
      "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log",
      onLines
    );
  }, []);

  const chunked = useChunked(logs, CHUNK_SIZE);

  const renderChunk = (chunk, index) => {
    const startIndex = index * CHUNK_SIZE;

    return <div className="grid">
      {index === 0 ? <div className="header">
        <div></div>
        <div>Time</div>
        <div>Event</div>
      </div> : null}
      {chunk.map((log, i) => {
        const rowIndex = startIndex + i;
        if (openRows.has(rowIndex)) {
          return (
            <React.Fragment key={rowIndex}>
              <div className="row no-border">
                <div className="caret" onClick={() => onToggleRow(rowIndex)}>
                  <span className="open">&gt;</span>
                </div>
                <div>{new Date(log._time).toISOString()}</div>
                <div></div>
              </div>
              <pre className="content">{prettyPrint(log)}</pre>
            </React.Fragment>
          );
        } else {
          return (
            <div className="row" key={rowIndex}>
              <div className="caret" onClick={() => onToggleRow(rowIndex)}>
                &gt;
              </div>
              <div>{new Date(log._time).toISOString()}</div>
              <div>{JSON.stringify(log)}</div>
            </div>
          );
        }
      })}
    </div>
  }

  return chunked.map((chunk, i) => renderChunk(chunk, i))
};
