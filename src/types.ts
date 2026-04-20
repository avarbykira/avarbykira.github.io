export type ImageInput = {
    src: ImageMetadata | string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: ImageInput;
    actions?: Link[];
};

export type Subscribe = {
    enabled?: boolean;
    title?: string;
    href?: string;
    buttonText?: string;
};

export type SiteConfig = {
    website: string;
    avatar?: ImageInput;
    title: string;
    subtitle?: string;
    description: string;
    image?: ImageInput;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};
