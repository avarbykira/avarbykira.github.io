import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import siteConfig from '../data/site-config.ts';
import { filterPublishedPosts, sortItemsByDateDesc } from '../utils/data-utils.ts';

export async function GET(context) {
    const posts = filterPublishedPosts(await getCollection('blog')).sort(sortItemsByDateDesc);
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: posts.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            content: marked.parse(item.body),
            link: `/blog/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    });
}
