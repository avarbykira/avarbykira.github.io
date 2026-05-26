import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { marked, Renderer } from 'marked';
import siteConfig from '../data/site-config.ts';
import aiFreeMarkdown from '../data/rss/ai-free.md?raw';
import footerMarkdown from '../data/rss/footer.md?raw';
import { filterPublishedGalleries, filterPublishedMusic, filterPublishedPosts, sortItemsByDateDesc } from '../utils/data-utils.ts';

function getFeedRenderer(site) {
    const renderer = new Renderer();
    const defaultLinkRenderer = renderer.link.bind(renderer);
    const defaultImageRenderer = renderer.image.bind(renderer);

    renderer.link = (token) => defaultLinkRenderer({ ...token, href: new URL(token.href, site).href });
    renderer.image = (token) => defaultImageRenderer({ ...token, href: new URL(token.href, site).href });

    return renderer;
}

function renderMarkdown(markdown, site) {
    return marked.parse(markdown.trim(), { async: false, renderer: getFeedRenderer(site) });
}

function getAiFreeBlock(site) {
    return `
<blockquote style="margin: 2rem 0 1.25rem; padding: 0 0 0 1rem; border-left: 3px solid #d8d8d8; color: #777; font-size: 0.95rem; line-height: 1.75; text-align: left;">
    ${renderMarkdown(aiFreeMarkdown, site)}
</blockquote>`;
}

function getWebNote(site) {
    return `
<aside style="margin: 1.5rem 0 0; padding: 1rem 0 0; border-top: 1px solid #dedede; color: #777; font-size: 0.95rem; line-height: 1.8; text-align: left;">
    ${renderMarkdown(footerMarkdown, site)}
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

function escapeHtml(value = '') {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getGalleryFigures(item, site) {
    return item.data.photos
        .map((photo) => {
            const src = new URL(photo.src.src, site).href;
            const caption = photo.caption ? `<figcaption>${marked.parseInline(photo.caption)}</figcaption>` : '';

            return `
<figure>
    <img src="${src}" alt="${escapeHtml(photo.alt ?? '')}" />
    ${caption}
</figure>`;
        })
        .join('');
}

function getMusicMedia(item, site) {
    const cover = item.data.cover
        ? `
<figure>
    <img src="${new URL(item.data.cover.src.src, site).href}" alt="${escapeHtml(item.data.cover.alt ?? '')}" />
</figure>`
        : '';
    const audioUrl = new URL(item.data.audio.src, site).href;
    const audioTitle = item.data.audio.title ?? item.data.title;

    return `
${cover}
<p><a href="${audioUrl}">Listen: ${escapeHtml(audioTitle)}</a></p>
<audio controls preload="metadata" src="${audioUrl}"></audio>`;
}

function getAudioEnclosure(item) {
    const { audio } = item.data;

    if (!audio.src.startsWith('/')) {
        return undefined;
    }

    try {
        const audioPath = fileURLToPath(new URL(`../../public${audio.src}`, import.meta.url));
        return {
            url: audio.src,
            length: statSync(audioPath).size,
            type: audio.type ?? 'audio/mpeg'
        };
    } catch {
        return undefined;
    }
}

export async function GET(context) {
    const posts = filterPublishedPosts(await getCollection('blog')).sort(sortItemsByDateDesc);
    const tracks = filterPublishedMusic(await getCollection('music')).sort(sortItemsByDateDesc);
    const galleries = filterPublishedGalleries(await getCollection('gallery')).sort(sortItemsByDateDesc);
    const items = [
        ...posts.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            content: [marked.parse(item.body), item.data.isAiFree ? getAiFreeBlock(context.site) : '', getWebNote(context.site)].join(''),
            link: `/blog/${item.id}/`,
            pubDate: item.data.publishDate
        })),
        ...tracks.map((item) => ({
            title: item.data.creator ? `${item.data.title} - ${item.data.creator}` : item.data.title,
            description: item.data.project ?? item.data.creator,
            content: [getMusicMedia(item, context.site), marked.parse(item.body), getWebNote(context.site)].join(''),
            link: `/music/${item.id}/`,
            pubDate: item.data.publishDate,
            categories: item.data.tags,
            enclosure: getAudioEnclosure(item)
        })),
        ...galleries.map((item) => ({
            title: item.data.title,
            description: item.data.excerpt ?? item.data.photos[0]?.caption,
            content: [getGalleryFigures(item, context.site), marked.parse(item.body), getWebNote(context.site)].join(''),
            link: `/gallery/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    ].sort((itemA, itemB) => new Date(itemB.pubDate).getTime() - new Date(itemA.pubDate).getTime());

    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        customData: getFeedImageData(context.site),
        items
    });
}
