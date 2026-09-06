import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogApi } from '../api';
import { apiErrorMessage } from '../hooks/useApiError';
import { ErrorNote } from '../components/ui/ErrorNote';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/Badge';
import { formatDate } from '../lib/format';
import type { BlogPostDetail } from '../types';

export default function BlogPostPage() {
  const { id = '' } = useParams();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogApi
      .get(id)
      .then((data) => !cancelled && setPost(data))
      .catch((err) => !cancelled && setError(apiErrorMessage(err, 'Yazı tapılmadı.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !post) {
    return (
      <div className="shell py-14">
        <ErrorNote message={error ?? 'Yazı tapılmadı.'} />
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand-blue">
          &larr; Ana səhifə
        </Link>
      </div>
    );
  }

  return (
    <article className="shell py-10 sm:py-14">
      <Link to="/#blog" className="text-sm font-semibold text-brand-blue">
        &larr; Blog
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="info">{post.tag}</StatusBadge>
          <span className="text-xs text-brand-faint">{post.readTime}</span>
          <span className="text-xs text-brand-faint">{formatDate(post.createdAt)}</span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-navy">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-slate">{post.excerpt}</p>
      </header>

      <div className="mt-8 max-w-3xl space-y-5">
        {post.body.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-brand-ink">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
