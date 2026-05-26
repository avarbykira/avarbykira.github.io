import type { CollectionEntry } from 'astro:content';

type GalleryEntry = CollectionEntry<'gallery'>;
type GalleryPhoto = GalleryEntry['data']['photos'][number];

export type GalleryPhotoItem = {
    gallery: GalleryEntry;
    photo: GalleryPhoto;
    photoIndex: number;
    anchor: string;
    href: string;
};

function getImagePath(src: GalleryPhoto['src']) {
    return typeof src === 'string' ? src : src.src;
}

function getFileStem(src: GalleryPhoto['src']) {
    const path = getImagePath(src).split('#')[0].split('?')[0];
    const filename = decodeURIComponent(path.split('/').pop() ?? '');
    return filename.replace(/\.[^.]+$/, '');
}

function slugifyFilename(filename: string) {
    const slug = filename
        .trim()
        .toLowerCase()
        .replace(/[/\\?#%]+/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return slug;
}

export function getGalleryPhotoAnchor(photo: GalleryPhoto, index: number) {
    return `photo-${slugifyFilename(getFileStem(photo.src)) || index + 1}`;
}

export function getGalleryPhotoItems(galleries: GalleryEntry[]): GalleryPhotoItem[] {
    return galleries.flatMap((gallery) =>
        gallery.data.photos.map((photo, photoIndex) => {
            const anchor = getGalleryPhotoAnchor(photo, photoIndex);

            return {
                gallery,
                photo,
                photoIndex,
                anchor,
                href: `/gallery/${gallery.id}/#${anchor}`
            };
        })
    );
}
