import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types';

const covers = [
  'from-[#1b58c4] to-[#0e2c61]',
  'from-[#0e7c6b] to-[#14418f]',
  'from-[#4b3fa8] to-[#1b58c4]',
];

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="shell scroll-mt-24 py-14 sm:py-16">
      <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">Blog</h2>
      <p className="mt-2 max-w-2xl text-sm text-brand-muted">
        Sinif təcrübəsi, rəqəmsal alətlər və müəllif olmaq haqqında qısa yazılar.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="card card-hover flex flex-col overflow-hidden !p-0"
          >
            <div
              aria-hidden
              className={`h-28 bg-gradient-to-br ${covers[index % covers.length]}`}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2">
                <span className="status-badge bg-online-bg text-online-text">{post.tag}</span>
                <span className="text-xs text-brand-faint">{post.readTime}</span>
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-brand-navy">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                {post.excerpt}
              </p>
              <span className="mt-4 font-heading text-sm font-semibold text-brand-blue">
                Oxu →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
