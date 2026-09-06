import { useEffect, useState } from 'react';
import { blogApi, resourcesApi, trainingsApi } from '../api';
import { computePlatformStats } from '../api/pending';
import { Hero } from '../components/home/Hero';
import { SectionCards } from '../components/home/SectionCards';
import { Testimonials } from '../components/home/Testimonials';
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
      const [resources, trainings, blog] = await Promise.allSettled([
        resourcesApi.list({ pageSize: 1 }),
        trainingsApi.list(),
        blogApi.list(),
      ]);

      if (cancelled) return;

      const resourceCount =
        resources.status === 'fulfilled' ? resources.value.totalCount : 0;
      const trainingList = trainings.status === 'fulfilled' ? trainings.value : [];
      setStats(computePlatformStats(resourceCount, trainingList));

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
      <Testimonials />
      <CertificateCheck />
      <FaqAccordion />
      <BlogSection posts={posts} />
    </>
  );
}
