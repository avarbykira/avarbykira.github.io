import avatar from '../assets/images/avatar.jpg';
import my_avatar from '../assets/images/my_avatar.jpeg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://avarbykira.github.io',
    // avatar: {
    //     src: my_avatar,
    //     alt: 'site config avatar'
    // },
    title: '水母 / Jellyfish',
    subtitle: '技术/音乐/摄影. 一个暂时还没想好怎么介绍自己的人。',
    description: '在不易发现的浅滩上，水母在这里伸展触角。',
    // image: {
    //     src: '/dante-preview.jpg',
    //     alt: 'Dante - Astro.js and Tailwind CSS theme'
    // },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        // {
        //     text: 'Projects',
        //     href: '/projects'
        // },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        // {
        //     text: 'Terms',
        //     href: '/terms'
        // },
        // {
        //     text: 'Download theme',
        //     href: 'https://github.com/JustGoodUI/dante-astro-theme'
        // }
    ],
    socialLinks: [ // TODO: 目前跳转会新开一个tab，需要在当前tab跳转
        {
            text: 'Theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        },
        // {
        //     text: 'Contact',
        //     href: '/contact'
        // },
        // {
        //     text: 'Dribbble',
        //     href: 'https://dribbble.com/'
        // },
        // {
        //     text: 'Instagram',
        //     href: 'https://instagram.com/'
        // },
        // {
        //     text: 'X/Twitter',
        //     href: 'https://twitter.com/'
        // }
    ],
    hero: {
        title: '',
        text:"***欢迎来到我的博客！*** \n\n在这里我会分享我最近的生活和感想、我参与制作的音乐、以及我拍的照片。\n\n现在这里的内容还有点少。你可以在这里随便逛逛，也可以用下面的RSS链接订阅我的博客，这样就可以在有新东西时收到通知了！",
        // text: "欢迎来到我的博客！你可以从这些地方开始探索:\n\n### [***Drafts***](/blog)\n\n这里包含我写的文字。我虽然没有真的离开社交媒体（虽然我有把小红书平台的个性化推荐关掉，因为这是影响力最大的时间黑洞），但是我对封闭平台也是深恶痛绝，所以在逐步尝试一些更开放的社交平台。看过[Wiwi的博客](https://wiwi.blog)并且真的愿意每天打开看，以及对各大平台的AI Slop真的感到exhausted后，我又决定把之前荒废的博客捡起来，并且真的偶尔写一些东西。\n\n### [***Tags***](/tags)\n\n这里包含文字内容的主题。我对「怎么用标签」这件事暂时还处于探索阶段，所以可能会有调整。如果你有好的建议，请发邮件给我！\n\n### [***Artboard***](/projects)\n\n这里包含我拍的照片、做的音乐，也许还会放一些平面设计的内容。业余时间里我喜欢拍照和做音乐，我也一直苦于没有一个统一的地方展示我的创作，放在博客上就很合适（又是一个写博客的好理由！）。",
        // image: {
        //     src: hero,
        //     alt: 'A person sitting at a desk in front of a computer'
        // },
        actions: [
            {
                text: 'RSS Feed',
                href: '/'   // TODO: 解决 RSS Feed 跳转
            },
        ]
    },
    subscribe: {
        enabled: true,
        title: '通过RSS订阅 第一时间接收内容更新',
        href: '/rss.xml',
        buttonText: 'Subscribe'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
