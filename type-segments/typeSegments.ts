const domainList: { [key: string]: string } = {
  "welt.de": "abcdef",
  "bild.de": "ghijkl",
};

class UserInfo {
  window: any;

  constructor(window: any) {
    this.window = window;
  }

  getHostname(address: string): string {
    // If address was passed without URL scheme, we first need to
    // get it to a canonical URL form by prefixing it with 'http'
    const url = address.startsWith("http") ? address : "http://" + address;
    const hostname = new URL(url).hostname;

    // To reliably check the domain against 'domainList',
    // we have to make sure that it consists only of top
    // two domain levels. For example:
    //   sub.computer.bild.de -> bild.de
    const domainsByLevels = hostname.split(".");
    return domainsByLevels
      .slice(domainsByLevels.length - 2, domainsByLevels.length)
      .join(".");
  }

  getDomainQueryId(domain: string): string {
    if (domain in domainList) {
      return domainList[domain];
    }

    throw new Error("Unknown domain: " + domain);
  }

  // this function contains dummy implementation
  isFrequencyTypeSegment(domain: string, segmentID: string): boolean {
    return segmentID === "mediumfrequencyUser";
  }

  getFrequencyTypeSegment(domain: string): string | null {
    if (!domain) {
      throw new Error("Domain is required");
    }

    const hostname = this.getHostname(domain);
    const domainId = this.getDomainQueryId(hostname);

    // we assume that API is always available, while other objects might
    // be optional depending on the user state
    let piano = this.window.Kameleoon.API.CurrentVisit?.customData?.Piano;

    if (!piano || !piano.length) {
      this.window.cX.getUserSegmentIds({
        persistedQueryId: domainId,
      });

      piano = this.window.Kameleoon.API.CurrentVisit?.customData?.Piano;
    }

    // in case if getUserSegmentIds fails to populate Piano object 
    // with data, we cannot iterate over the list
    if (piano) {
      for (const segmentID of piano) {
        if (this.isFrequencyTypeSegment(hostname, segmentID)) {
          return segmentID;
        }
      }
    }

    return null;
  }
}

export default UserInfo;
