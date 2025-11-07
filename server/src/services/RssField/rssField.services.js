const RssField = require("../../models/index")["RssField"];
const Parser = require("rss-parser");

class RssFieldService {
  constructor() {
    this.rssField = RssField;
  }

  async cryptoNews() {
    const parser = new Parser();
    const feed = await parser.parseURL("https://coinacademy.fr/actu/gn");

    const feedMap = feed.items.map((item) => {
      let title = item.title.toString("utf8");
      let link = item.link;
      let pubDate = item.pubDate;
      let content = item.content;
      let contentEncoded = item["content:encoded"]
        .toString("utf8")
        .replace(/<img[^>]*>/g, "")
        .replace(/<figure[^>]*>|<[/^]figure>/g, "")
        .replace(/\\xF0\\x9F\\x94\\xB4/g, "")
        .replace(/\\[^\s]+/g, "");

      return this.create({
        title: title,
        link: link,
        pubDate: pubDate,
        content: content,
        contentEncoded: contentEncoded,
      });
    });

    return feedMap;
  }

  async create(rssField) {
    return await this.rssField.create(rssField).then((rssField) => {
      if (rssField) {
        return rssField;
      } else {
        throw new Error("rssField not created");
      }
    }).catch((error) => {
      if(error) {
        return;
      };
    });
  }

  async findAll() {
    return await this.rssField.findAll({}).then((rssFields) => {
      if (rssFields) {
        return rssFields;
      } else {
        throw new Error("No rssFields found");
      }
    });
  }

  async findOne(id) {
    return await this.rssField
      .findOne({
        where: {
          id: id,
        },
      })
      .then((rssField) => {
        if (rssField) {
          return rssField;
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }
  async delete(id) {
    return await this.rssField
      .destroy({
        where: {
          id: id,
        },
      })
      .then((num) => {
        if (num == 1) {
          return this.findAll();
        }
      })
      .catch((error) => {
        throw new Error("rssField not found with id " + id);
      });
  }
}

module.exports = RssFieldService;
