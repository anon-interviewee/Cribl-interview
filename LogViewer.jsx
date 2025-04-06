import * as React from "react";
import { fetchLogs, prettyPrint } from "./utils.jsx";

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
