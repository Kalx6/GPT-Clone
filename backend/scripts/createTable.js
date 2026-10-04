import db from "../db/db.config.js"; // adjust to your project

const sql = `
CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user','assistant') NOT NULL,
    content TEXT NOT NULL,
    token_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

try {
  await db.query(sql);
  console.log("Table created successfully!");
} catch (err) {
  console.error(err);
} finally {
  process.exit();
}
