import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import siteConfig from '../data/site-config.ts';
import { filterPublishedPosts, sortItemsByDateDesc } from '../utils/data-utils.ts';

const aiFreeBlock = `
<blockquote style="margin: 2rem 0 1.25rem; padding: 0 0 0 1rem; border-left: 3px solid #d8d8d8; color: #777; font-size: 0.95rem; line-height: 1.75; text-align: left;">
    <p style="margin: 0;"><strong style="color: #666;">This post is AI FREE. </strong> 本文未经 AI 生成或润色，每个字都由我亲手敲下。</p>
</blockquote>`;

function getWebNote(site) {
    const blogUrl = new URL('/', site).href;

    return `
<aside style="margin: 1.5rem 0 0; padding: 1rem 0 0; border-top: 1px solid #dedede; color: #777; font-size: 0.95rem; line-height: 1.8; text-align: left;">
    如果你喜欢这篇文章，不妨来<a href="${blogUrl}" style="color: #666; text-decoration: underline;">水母公园</a>散散步。小径和长椅都由我亲手摆放，沿途没准还能遇见我做的歌，以及一些只在网页里开放的小角落。
</aside>`;
}

function getFeedImageData(site) {
    return `
<image>
    <url>${new URL('/rss-icon.png', site).href}</url>
    <title>${siteConfig.title}</title>
    <link>${new URL('/', site).href}</link>
    <width>144</width>
    <height>144</height>
</image>`;
}

export async function GET(context) {
    const posts = filterPublishedPosts(await getCollection('blog')).sort(sortItemsByDateDesc);
    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        customData: getFeedImageData(context.site),
        items: posts.map((item) => {
            const link = `/blog/${item.id}/`;

            return {
                title: item.data.title,
                description: item.data.excerpt,
                content: [marked.parse(item.body), item.data.isAiFree ? aiFreeBlock : '', getWebNote(context.site)].join(''),
                link,
                pubDate: item.data.publishDate
            };
        })
    });
}
