import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://www.tcli.me',
    title: '水母公园 Jellypark',
    subtitle: '在不易发现的浅滩之上，水母正慢慢伸展触角。',
    description: '在不易发现的浅滩上，水母在这里伸展触角。',
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Music',
            href: '/music'
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
        {
            text: 'RSS',
            href: '/rss.xml'
        }
    ],
    socialLinks: [],
    hero: {
        title: '',
        text: '***欢迎到访水母公园！***🪼 \n\n在这里我会分享我最近的生活和感想、我参与制作的音乐、以及我拍的照片。\n\n我希望把这里打造成「**让人觉得舒适和有趣的空间**」，如果你好奇这里会如何演化，就请用 [RSS 订阅](/rss.xml)，或者收藏我的博客吧！',
        actions: []
    },
    subscribe: {
        enabled: true,
        title: '通过RSS订阅 第一时间接收内容更新',
        href: '/rss.xml',
        buttonText: 'Subscribe'
    },
    postsPerPage: 8,
    projectsPerPage: 8,
    musicPerPage: 8
};

export default siteConfig;
