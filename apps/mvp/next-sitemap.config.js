/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.aplicirano.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // ključni deo: i18n
  i18n: {
    locales: ["en", "sr"],
    defaultLocale: "en",
  },
};
