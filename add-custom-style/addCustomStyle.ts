class StyleDecorator {
  check(arg: any, argName: string): void {
    if (!arg) {
      throw new Error(`${argName} is required for styling, but not provided.`);
    }
  }

  addCustomStyle(
    styleIdentifier: string,
    selector: string,
    attributes: string,
    mediaQuery?: string | undefined
  ): void {
    this.check(styleIdentifier, "styleIdentifier");
    this.check(selector, "selector");
    this.check(attributes, "attributes");

    const attributesTrimmed = attributes.trim();
    if (
      !attributesTrimmed.startsWith("{") ||
      !attributesTrimmed.endsWith("}")
    ) {
      throw new Error("Attributes must be surrounded by brackets");
    }

    const sheet = document.createElement("style");
    sheet.id = styleIdentifier;

    let result = selector + attributes;

    if (mediaQuery) {
      result = "@media " + "(" + mediaQuery + ")" + "{" + result + "}";
    }

    sheet.appendChild(document.createTextNode(result));
    document.body.appendChild(sheet);
  }
}

export default StyleDecorator;
