const shell = require("./shell");
const isIp = require("is-ip");
const logs = require("../logs.js")(module);

const urls = [
  "https://ns.dappnode.io/myip",
  "http://ipv4.icanhazip.com",
  "http://ident.me"
];

/**
 * Attempts to get an IP from the above list of urls sequentially
 * - If the first link doesn't return a valid IP, the second url is attempted
 * - If all urls have replied invalid IPs, then an error is returned
 *
 * @param {Boolean} silent suppress logs
 * @return {String} public IP: 85.84.83.82
 */
async function getPublicIpFromUrls({ silent } = {}) {
  let errors = [];
  for (const url of urls) {
    try {
      // wget
      // -t: tries 3 times
      // -T: timeout after 15 seconds
      // -q: quiet, suppress all output except the IP
      // O-: output ?
      const ip = await shell(`wget -t 3 -T 15 -qO- ${url}`, { trim: true });
      if (isIp(ip)) return ip;
      else throw Error(`Invalid IP format: ${ip}`);
    } catch (e) {
      const error = `Error getting IP from ${url}: ${e.message}`;
      errors.push(error);
      if (!silent) logs.error(error);
    }
  }
  if (!silent)
    logs.error(`No valid IP was returned by urls:\n${errors.join("\n")}`);
}

module.exports = getPublicIpFromUrls;
