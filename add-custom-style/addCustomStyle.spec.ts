import StyleDecorator from "./addCustomStyle";

describe("style decorator", () => {
  const styleDecorator = new StyleDecorator();

  afterEach(() => {
    // Unfortunately, jest does not reset the state of the DOM between
    // test runs. Hence, we have to do it ourselves :(
    document.body.innerHTML = "";
  });

  test("creates a style without mediaquery", () => {
    styleDecorator.addCustomStyle(
      "myStyle",
      ".someClassName",
      "{background-color: #cccccc;}"
    );
    expect(document.body).toMatchSnapshot();
  });

  test("creates a style with a provided mediaQuery", () => {
    styleDecorator.addCustomStyle(
      "myStyle",
      ".someClassName",
      "{background-color: #cccccc;}",
      "max-width: 909px"
    );

    expect(document.body).toMatchSnapshot();
  });

  test("fails if any mandatory argument is missing", () => {    
    expect(() => {       
      styleDecorator.addCustomStyle(undefined, "two", "three");
    }).toThrowError();
    expect(() => {
      styleDecorator.addCustomStyle("one", undefined, "three");
    }).toThrowError();
    expect(() => {
      styleDecorator.addCustomStyle("one", "two", undefined);
    }).toThrowError();
  });

  test("fails if any of mandatory arguments are present but empty", () => {
    expect(() => {
      styleDecorator.addCustomStyle("", "two", "three");
    }).toThrowError();
    expect(() => {
      styleDecorator.addCustomStyle("one", "", "three");
    }).toThrowError();
    expect(() => {
      styleDecorator.addCustomStyle("one", "two", "");
    }).toThrowError();
  });

  test("fails if brackets around attributes are missing", () => {
    expect(() => {
      styleDecorator.addCustomStyle(
        "myStyle",
        ".someClassName",
        "background-color: #cccccc;"
      );
    }).toThrowError();
  });

  test("attributes surrounded by space must still be valid", () => {
    styleDecorator.addCustomStyle(
      "myStyle",
      ".someClassName",
      "  {background-color: #cccccc;} "
    );
    expect(document.body).toMatchSnapshot();
  });
});
