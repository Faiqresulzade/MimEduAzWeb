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
    <section id="blog" className="shell scroll-mt-24 py-4 lg:py-16">
      <h2 className="font-heading text-[22px] font-bold text-brand-navy lg:text-3xl">Blog</h2>
      <p className="mt-3 max-w-2xl text-[13px] text-brand-muted lg:mt-2 lg:text-sm">
        Sinif təcrübəsi, rəqəmsal alətlər və müəllif olmaq haqqında qısa yazılar.
      </p>

      <div className="mt-3 grid gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-4">
        {posts.slice(0, 3).map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="card card-hover flex flex-col overflow-hidden !p-0"
          >
            <div
              aria-hidden
              className={`h-[72px] bg-gradient-to-br lg:h-28 ${covers[index % covers.length]}`}
            />
            <div className="flex flex-1 flex-col gap-2 p-5 lg:gap-0">
              <div className="flex items-center gap-2">
                <span className="status-badge bg-online-bg text-online-text">{post.tag}</span>
                <span className="text-xs text-brand-faint">{post.readTime}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold leading-6 text-brand-navy lg:mt-3 lg:text-base lg:leading-snug">
                {post.title}
              </h3>
              <p className="flex-1 text-[13px] leading-[18px] text-brand-muted lg:mt-2 lg:text-sm lg:leading-relaxed">
                {post.excerpt}
              </p>
              <span className="font-heading text-sm font-semibold text-brand-blue lg:mt-4">
                Oxu →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
