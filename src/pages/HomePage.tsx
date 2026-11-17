import { useEffect, useState } from 'react';
import { blogApi, statsApi } from '../api';
import { Hero } from '../components/home/Hero';
import { SectionCards } from '../components/home/SectionCards';
import { CertificateCheck } from '../components/home/CertificateCheck';
import { FaqAccordion } from '../components/home/FaqAccordion';
import { BlogSection } from '../components/home/BlogSection';
import type { BlogPost, PlatformStats } from '../types';

export default function HomePage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Statistika yalnız bazadakı real rəqəmlərdir (heç bir "baza rəqəm" əlavə edilmir).
      const [stats, blog] = await Promise.allSettled([statsApi.get(), blogApi.list()]);

      if (cancelled) return;

      if (stats.status === 'fulfilled') setStats(stats.value);

      if (blog.status === 'fulfilled') setPosts(blog.value);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero stats={stats} />
      <SectionCards />
      <CertificateCheck />
      <FaqAccordion />
      <BlogSection posts={posts} />
    </>
  );
}
