import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogDetailPage.css';
import { blogPosts as allPosts } from '../data/blogData';

const BlogDetailPage = () => {
  const { id } = useParams();
  const post = allPosts.find((p) => p.id === Number(id));

  // Reading progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="blog-detail-notfound container">
        <h2>Bài viết không tồn tại</h2>
        <Link to="/blog" className="btn btn-primary">← Quay lại Blog</Link>
      </div>
    );
  }

  // Other posts for sidebar
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="blog-detail-page">
      {/* Reading Progress Bar */}
      <div className="bd-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Hero image */}
      <div className="bd-hero" style={{ backgroundImage: `url(${post.image})` }}>
        <div className="bd-hero-overlay">
          <div className="bd-hero-inner container text-center">
            <span className="bd-cat">{post.category}</span>
            <h1 className="bd-title mx-auto">{post.title}</h1>
            <div className="bd-meta justify-center">
              <span className="bd-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                {post.author}
              </span>
              <span className="bd-dot">·</span>
              <span className="bd-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {post.date}
              </span>
              <span className="bd-dot">·</span>
              <span className="bd-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="bd-body container">
        <div className="bd-grid">
          {/* Main article */}
          <article className="bd-article">
            {post.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i} className="bd-h2">{block.text}</h2>;
              if (block.type === 'quote') return (
                <blockquote key={i} className="bd-quote">
                  <p>{block.text}</p>
                </blockquote>
              );

              // paragraph — handle \n as line breaks
              // First paragraph gets drop-cap class
              return (
                <p key={i} className={`bd-p ${i === 0 ? 'bd-drop-cap' : ''}`}>
                  {block.text.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < block.text.split('\n').length - 1 && <br />}</span>
                  ))}
                </p>
              );
            })}

            {/* Share Section */}
            <div className="bd-share">
              <span className="bd-share-label">Chia sẻ bài viết:</span>
              <div className="bd-share-btns">
                <button className="share-btn fb" title="Chia sẻ Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </button>
                <button className="share-btn zalo" title="Chia sẻ Zalo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.58 2 10c0 2.42 1.31 4.56 3.4 6.04-.15.86-.54 2.14-.54 2.14s1.65-.65 2.87-1.12c.98.24 2.05.38 3.17.38l1.1.06c4.95.27 9 1.48 9 2.7 0 .61-1.02 1.15-2.67 1.49C16.94 21.84 14.6 22 12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2z" /></svg>
                </button>
                <button className="share-btn link" title="Sao chép liên kết" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết vào bộ nhớ tạm!');
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
              </div>
            </div>

            {/* Back link */}
            <Link to="/blog" className="bd-back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Quay lại Chuyện Trà Sữa
            </Link>
          </article>

          {/* Sidebar */}
          <aside className="bd-sidebar">
            <h3 className="bd-sidebar-title">Bài viết khác</h3>
            <div className="bd-related">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.id}`} className="bd-related-card">
                  <img src={r.image} alt={r.title} className="bd-related-img" />
                  <div className="bd-related-body">
                    <span className="bd-related-cat">{r.category}</span>
                    <p className="bd-related-title">{r.title}</p>
                    <span className="bd-related-date">{r.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
