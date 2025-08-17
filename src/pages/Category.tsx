import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { wordpressApi, type Post, type Category as CategoryType } from '../services/wordpressApi.ts';
import PostCard from '../components/PostCard.tsx';

function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const [categoryData, postsData] = await Promise.all([
          wordpressApi.getCategoryBySlug(slug),
          wordpressApi.getPosts({ categories: slug, per_page: 20 })
        ]);
        
        setCategory(categoryData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
        <p className="text-gray-600">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">{category.count} posts</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default Category;