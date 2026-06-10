import rss from '@astrojs/rss';
import { getImage } from 'astro:assets';
import imageAssetMap from 'astro:asset-imports';
import { getCollection } from 'astro:content';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { marked, Renderer } from 'marked';
import siteConfig from '../data/site-config.ts';
import aiFreeMarkdown from '../data/rss/ai-free.md?raw';
import footerMarkdown from '../data/rss/footer.md?raw';
import { filterPublishedGalleries, filterPublishedMusic, filterPublishedPosts, sortItemsByDateDesc } from '../utils/data-utils.ts';

const CONTENT_IMAGE_FLAG = 'astroContentImageFlag';

function getFeedRenderer(site, imageUrls = new Map()) {
    const renderer = new Renderer();
    const defaultLinkRenderer = renderer.link.bind(renderer);
    const defaultImageRenderer = renderer.image.bind(renderer);

    renderer.link = (token) => defaultLinkRenderer({ ...token, href: new URL(token.href, site).href });
    renderer.image = (token) => defaultImageRenderer({ ...token, href: imageUrls.get(token.href) ?? new URL(token.href, site).href });

    return renderer;
}

function collectImageHrefs(tokens, imageHrefs = new Set()) {
    for (const token of tokens) {
        if (token.type === 'image' && token.href) {
            imageHrefs.add(token.href);
        }

        if (Array.isArray(token.tokens)) {
            collectImageHrefs(token.tokens, imageHrefs);
        }

        if (Array.isArray(token.items)) {
            for (const item of token.items) {
                collectImageHrefs(item.tokens ?? [], imageHrefs);
            }
        }
    }

    return imageHrefs;
}

function getContentImageImportId(imageSrc, filePath) {
    const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
    params.set('importer', filePath);

    return `${imageSrc}?${params.toString()}`;
}

async function resolveFeedImageUrl(imageSrc, filePath, site) {
    if (URL.canParse(imageSrc)) {
        return imageSrc;
    }

    if (filePath) {
        const importedImage = imageAssetMap.get(getContentImageImportId(imageSrc, filePath));

        if (importedImage) {
            const image = await getImage({ src: importedImage });
            return new URL(image.src, site).href;
        }
    }

    return new URL(imageSrc, site).href;
}

async function getMarkdownImageUrls(markdown, filePath, site) {
    const imageHrefs = collectImageHrefs(marked.lexer(markdown));
    const imageUrls = new Map();

    await Promise.all(
        [...imageHrefs].map(async (imageHref) => {
            imageUrls.set(imageHref, await resolveFeedImageUrl(imageHref, filePath, site));
        })
    );

    return imageUrls;
}

function renderMarkdown(markdown, site, imageUrls) {
    return marked.parse(markdown.trim(), { async: false, renderer: getFeedRenderer(site, imageUrls) });
}

async function renderEntryMarkdown(item, site) {
    return renderMarkdown(item.body, site, await getMarkdownImageUrls(item.body, item.filePath, site));
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
    const postItems = await Promise.all(
        posts.map(async (item) => ({
            title: item.data.title,
            description: item.data.excerpt,
            content: [await renderEntryMarkdown(item, context.site), item.data.isAiFree ? getAiFreeBlock(context.site) : '', getWebNote(context.site)].join(''),
            link: `/blog/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    );
    const trackItems = await Promise.all(
        tracks.map(async (item) => ({
            title: item.data.creator ? `${item.data.title} - ${item.data.creator}` : item.data.title,
            description: item.data.project ?? item.data.creator,
            content: [getMusicMedia(item, context.site), await renderEntryMarkdown(item, context.site), getWebNote(context.site)].join(''),
            link: `/music/${item.id}/`,
            pubDate: item.data.publishDate,
            categories: item.data.tags,
            enclosure: getAudioEnclosure(item)
        }))
    );
    const galleryItems = await Promise.all(
        galleries.map(async (item) => ({
            title: item.data.title,
            description: item.data.excerpt ?? item.data.photos[0]?.caption,
            content: [getGalleryFigures(item, context.site), await renderEntryMarkdown(item, context.site), getWebNote(context.site)].join(''),
            link: `/gallery/${item.id}/`,
            pubDate: item.data.publishDate
        }))
    );
    const items = [
        ...postItems,
        ...trackItems,
        ...galleryItems
    ].sort((itemA, itemB) => new Date(itemB.pubDate).getTime() - new Date(itemA.pubDate).getTime());

    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        customData: getFeedImageData(context.site),
        items
    });
}
