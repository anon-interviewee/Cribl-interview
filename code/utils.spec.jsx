import fetch from 'isomorphic-fetch';
import { render } from "@testing-library/react";
import { fetchLogs, prettyPrint } from "./utils";

it("prints json with correct classes and indentation", () => {  
  const pretty = prettyPrint(
    {
      _time: 1722770321013,
      cid: "api",
      aNum: 1.23,
      aBool: true,
      numberArray: [1, 2, 3],
      nested: {
        aNum: 1.23,
        aBool: true,
        stringArray: ["one", "two", "three"],
      },
    }
  );

  const component = render(pretty);
  expect(component.container.innerHTML).toMatchInlineSnapshot(`
"{
  <span class="key">"_time"</span>: <span class="number">1722770321013</span>,
  <span class="key">"cid"</span>: <span class="string">"api"</span>,
  <span class="key">"aNum"</span>: <span class="number">1.23</span>,
  <span class="key">"aBool"</span>: <span class="boolean">true</span>,
  <span class="key">"numberArray"</span>: [
    <span class="number">1</span>,
    <span class="number">2</span>,
    <span class="number">3</span>
  ],
  <span class="key">"nested"</span>: {
    <span class="key">"aNum"</span>: <span class="number">1.23</span>,
    <span class="key">"aBool"</span>: <span class="boolean">true</span>,
    <span class="key">"stringArray"</span>: [
      <span class="string">"one"</span>,
      <span class="string">"two"</span>,
      <span class="string">"three"</span>
    ]
  }
}"
`);
});

it("Downloads the log in chunks correctly", async () => {
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";
  
  let expected = await (await fetch(url)).text();
  let actual = '';
  await fetchLogs(url, (data) => actualLogs += data);

  expect(expected).toEqual(actual)
})
