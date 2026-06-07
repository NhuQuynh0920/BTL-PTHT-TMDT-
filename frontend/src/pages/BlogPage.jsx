import { useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

import { blogPosts as posts } from '../data/blogData';

const TABS = ['Tất cả', 'Trà Sữa', 'Khuyến Mãi', 'Blog'];

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const filtered =
    activeTab === 'Tất cả'
      ? posts
      : posts.filter((p) => p.category === activeTab);

  return (
    <div className="blog-page">
      {/* ---- Hero ---- */}
      <div className="blog-hero">
        <div className="blog-hero-inner">
          <span className="blog-hero-eyebrow">MoRa Tea - Nơi Trà Lên Tiếng</span>
          <h1 className="blog-hero-title">Chuyện Nhà MoRa </h1>
          <p className="blog-hero-desc">
            Những lát cắt nhỏ về hành trình của từng lá trà, nguồn gốc nguyên liệu<br />
            và văn hóa thưởng trà đời thường của người Việt.
          </p>
        </div>

        {/* Tab filters */}
        <div className="blog-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`blog-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Posts Grid ---- */}
      <div className="blog-grid-wrapper">
        <div className="blog-grid">
          {filtered.map((post) => (
            <article key={post.id} className="blog-card">
              <Link to={`/blog/${post.id}`} className="blog-card-img-link">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-card-img"
                />
                <span className="blog-card-category">{post.category}</span>
              </Link>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span className="dot">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="blog-card-title">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="blog-read-more">
                  Đọc thêm →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
