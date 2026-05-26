import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';

export function sortItemsByDateDesc(
    itemA: CollectionEntry<'blog' | 'projects' | 'music' | 'gallery'>,
    itemB: CollectionEntry<'blog' | 'projects' | 'music' | 'gallery'>
) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export function filterPublishedPosts(posts: CollectionEntry<'blog'>[]) {
    return posts.filter((post) => !post.data.isDraft);
}

export function filterPublishedProjects(projects: CollectionEntry<'projects'>[]) {
    return projects.filter((project) => !project.data.isDraft);
}

export function filterPublishedMusic(tracks: CollectionEntry<'music'>[]) {
    return tracks.filter((track) => !track.data.isDraft);
}

export function filterPublishedGalleries(galleries: CollectionEntry<'gallery'>[]) {
    return galleries.filter((gallery) => !gallery.data.isDraft);
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagId));
    return filteredPosts;
}
