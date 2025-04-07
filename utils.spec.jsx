import { render } from "@testing-library/react";
import { prettyPrint } from "./utils";
import * as React from "react";

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
