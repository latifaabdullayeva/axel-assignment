import UserInfo from "./typeSegments"

describe("given piano, user info ", () => {
  const windowMock = {
    Kameleoon: {
      API: {
        CurrentVisit: {
          customData: {
            Piano: [] as string[],
          },
        },
      },
    },
    cX: {
      getUserSegmentIds(args: { persistedQueryId: string }): void {
        windowMock.Kameleoon.API.CurrentVisit.customData.Piano.push(
          "lowfrequencyUser",
          "mediumfrequencyUser",
          "highfrequencyUser",
          "iOSUser",
          "androidUser",
          "windowsUsers"
        );
      },
    },
  };

  const userInfo = new UserInfo(windowMock);

  test("resolves expected frequency type for welt.de", () => {
    expect(userInfo.getFrequencyTypeSegment("welt.de")).toBe(
      "mediumfrequencyUser"
    );
  });

  test("resolves a supported domain from a url", () => {
    expect(userInfo.getFrequencyTypeSegment("https://www.welt.de/")).toBe(
      "mediumfrequencyUser"
    );
    expect(userInfo.getFrequencyTypeSegment("https://www.bild.de/")).toBe(
      "mediumfrequencyUser"
    );
  });

  test("resolves a supported domain from multilevel domain address", () => {
    expect(userInfo.getFrequencyTypeSegment("www.bild.de")).toBe(
      "mediumfrequencyUser"
    );
    expect(userInfo.getFrequencyTypeSegment("computer.bild.de")).toBe(
      "mediumfrequencyUser"
    );
    expect(userInfo.getFrequencyTypeSegment("sub.computer.bild.de")).toBe(
      "mediumfrequencyUser"
    );
  });

  test("resolves a supported domain from a url with path and query params", () => {
    expect(
      userInfo.getFrequencyTypeSegment(
        "sub.computer.bild.de/somerandompath?query=param"
      )
    ).toBe("mediumfrequencyUser");
  });

  test("resolves expected frequency type for bild.de", () => {
    expect(userInfo.getFrequencyTypeSegment("bild.de")).toBe(
      "mediumfrequencyUser"
    );
  });

  test("fails to resole an arbitrary string", () => {
    expect(() => {
      userInfo.getFrequencyTypeSegment("");
    }).toThrow();
    expect(() => {
      userInfo.getFrequencyTypeSegment(".");
    }).toThrow();
    expect(() => {
      userInfo.getFrequencyTypeSegment("abc");
    }).toThrow();
  });

  test("resolves an unsupported domain and fails", () => {
    expect(() => {
      userInfo.getFrequencyTypeSegment("google.de");
    }).toThrow();
  });
});

describe("user info ", () => {
  test("without piano, does not resolve expected frequency type", () => {
    const windowMock = {
      Kameleoon: {
        API: {
          CurrentVisit: {
            customData: {
              Piano: [] as string[],
            },
          },
        },
      },
      cX: {
        getUserSegmentIds(args: { persistedQueryId: string }): void {},
      },
    };
    const userInfo = new UserInfo(windowMock);
    expect(userInfo.getFrequencyTypeSegment("bild.de")).toBeNull();
  });

  test("without customData, does not resolve expected frequency type", () => {
    const windowMock = {
      Kameleoon: {
        API: {
          CurrentVisit: {},
        },
      },
      cX: {
        getUserSegmentIds(args: { persistedQueryId: string }): void {},
      },
    };
    const userInfo = new UserInfo(windowMock);
    expect(userInfo.getFrequencyTypeSegment("bild.de")).toBeNull();
  });

  test("without customData, does not resolve expected frequency type", () => {
    const windowMock = {
      Kameleoon: {
        API: {},
      },
      cX: {
        getUserSegmentIds(args: { persistedQueryId: string }): void {},
      },
    };
    const userInfo = new UserInfo(windowMock);
    expect(userInfo.getFrequencyTypeSegment("bild.de")).toBeNull();
  });
});
