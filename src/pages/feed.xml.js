import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');

  const sortedArticles = articles
    .sort((a, b) => new Date(b.data.publishDate).valueOf() - new Date(a.data.publishDate).valueOf())
    .slice(0, 20);

  return rss({
    title: 'Selcurate',
    description: 'Carefully selected home products. Real data, real user insights.',
    site: context.site,
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.description,
      link: `/${article.data.room}/${article.data.category}/${article.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
