import express, { json } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req, res) => {
  res.json("You know, I'm something of a root route myself.");
});

app.get("/posts", async function (req, res) {
  const result = await db.query(`
    SELECT 
      posts.id, 
      posts.title,
      posts.content,
      categories.name AS category,
      ARRAY_AGG(tags.name) AS tags
    FROM posts
    JOIN categories ON posts.category_id = categories.id
    JOIN posts_tags ON posts.id = posts_tags.post_id
    JOIN tags ON posts_tags.tag_id = tags.id
    GROUP BY posts.id, categories.id;
    `);
  const posts = result.rows;
  res.json(posts);
});

app.post("/posts", async function (req, res) {
  const { title, content, category, tags } = req.body;

  //insert into posts table
  const postResult = await db.query(
    `INSERT INTO posts (title, content) VALUES ($1, $2)`,
    [title, content]
  );

  const categoryResult = await db.query(
    `INSERT INTO categories (category) VALUES ($1)`,
    [category]
  );

  const tagsResult = await db.query(`INSERT INTO tags (tags) VALUES ($1)`, [
    tags,
  ]);

  res.json(result);
});

app.listen(3000, function () {
  console.log(`Server is running on port 3000`);
});
