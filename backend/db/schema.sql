 CREATE TABLE conversations (
    ->     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -> 
    ->     role ENUM('user', 'assistant') NOT NULL,
    -> 
    ->     content TEXT NOT NULL,
    -> 
    ->     token_count INT UNSIGNED DEFAULT 0,
    -> 
    ->     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -> );

RENAME TABLE
mydatabase.conversations TO ai_chat_app.conversations;
