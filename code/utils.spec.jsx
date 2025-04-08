import { render, renderHook } from "@testing-library/react";
import { useChunked, prettyPrint } from "./utils";

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

it("chunks the logs correctly", () => {
  const data = (new Array(9842)).fill(0).map((_, i) => i);

  const chunked = renderHook(() => useChunked(data, 1000)).result.current;
  const flat = chunked.flatMap((x) => x);

  expect(chunked.length).toBe(10);
  expect(chunked[chunked.length - 1].length).toBe(842);
  expect(flat.length).toBe(9842);
  expect(flat[0]).toBe(0);
  expect(flat[flat.length - 1]).toBe(9841);
})
