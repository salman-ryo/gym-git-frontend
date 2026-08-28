export const socialLinks = {
  github: 'https://github.com/salman-ryo/gym-git-frontend',
  linkedin: 'https://www.linkedin.com/in/dev-salm',
} as const;

export const footerLinks = {
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  credits: '/credits',
} as const;

export const navLinks = {
  home: '/',
  dashboard: '/dashboard',
  login: '/login',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  credits: '/credits',
} as const;

export type SocialLinks = typeof socialLinks;
export type FooterLinks = typeof footerLinks;
export type NavLinks = typeof navLinks;