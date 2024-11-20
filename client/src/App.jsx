import { useState, useEffect } from "react";

export default function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(
        "https://database-react-app.onrender.com/posts"
      );
      const data = await response.json();
      setPosts(data);
      console.log(data);
    }

    getPosts();
  }, []);
  return (
    <div>
      <h1>Posts</h1>
      <div className="posts-container">
        {posts.map((post) => {
          return (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <h4>Category</h4>
              <p>{post.category}</p>
              <h4>Tags</h4>
              <ul>
                {post.tags.map((tag) => {
                  return <li key={tag}>#{tag}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
