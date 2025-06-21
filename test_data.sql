-- TypingApplication テストデータ挿入スクリプト

-- 1. ランクマスターデータの挿入（m_rank）
INSERT INTO m_rank (rank, created_at, updated_at, del_flg) VALUES
('ブロンズ', NOW(), NOW(), false),
('シルバー', NOW(), NOW(), false),
('ゴールド', NOW(), NOW(), false),
('プラチナ', NOW(), NOW(), false),
('ダイヤモンド', NOW(), NOW(), false);

-- 2. 言語マスターデータの挿入（m_lang）
INSERT INTO m_lang (lang, created_at, updated_at, del_flg) VALUES
('日本語', NOW(), NOW(), false),
('英語', NOW(), NOW(), false);

-- 3. 難易度マスターデータの挿入（m_diff）
INSERT INTO m_diff (diff, created_at, updated_at, del_flg) VALUES
('初級', NOW(), NOW(), false),
('中級', NOW(), NOW(), false),
('上級', NOW(), NOW(), false);

-- 4. ユーザーデータの挿入（m_user）
INSERT INTO m_user (user_id, rank_id, username, email, password, permission, is_newgraduate, is_superuser, is_staff, is_active, date_joined, created_at, updated_at, del_flg) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'testuser1', 'test1@example.com', 'hashed_password_1', 1, false, false, false, true, NOW(), NOW(), NOW(), false),
('550e8400-e29b-41d4-a716-446655440002', 2, 'testuser2', 'test2@example.com', 'hashed_password_2', 1, true, false, false, true, NOW(), NOW(), NOW(), false),
('550e8400-e29b-41d4-a716-446655440003', 3, 'testuser3', 'test3@example.com', 'hashed_password_3', 1, false, false, false, true, NOW(), NOW(), NOW(), false),
('550e8400-e29b-41d4-a716-446655440004', 4, 'testuser4', 'test4@example.com', 'hashed_password_4', 1, true, false, false, true, NOW(), NOW(), NOW(), false),
('550e8400-e29b-41d4-a716-446655440005', 5, 'admin_user', 'admin@example.com', 'hashed_admin_password', 0, false, true, true, true, NOW(), NOW(), NOW(), false);

-- 5. スコアデータの挿入（t_score）
INSERT INTO t_score (user_id, score, lang_id, diff_id, typing_count, accuracy, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1500, 1, 1, 100, 0.85, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440001', 1800, 1, 2, 120, 0.90, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440001', 2200, 1, 3, 150, 0.88, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440002', 2000, 1, 1, 130, 0.92, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440002', 2500, 1, 2, 160, 0.89, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440003', 3000, 1, 2, 200, 0.94, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440003', 3500, 1, 3, 220, 0.91, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440004', 4000, 1, 3, 250, 0.96, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', 5000, 1, 3, 300, 0.98, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 1200, 2, 1, 80, 0.82, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440002', 1600, 2, 1, 100, 0.87, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440003', 2000, 2, 2, 120, 0.90, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

-- 6. ミスタイプデータの挿入（t_miss）
INSERT INTO t_miss (user_id, miss_char, miss_count, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'あ', 5, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440001', 'い', 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440001', 'う', 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440002', 'え', 4, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440002', 'お', 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440003', 'か', 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440003', 'き', 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440004', 'く', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', 'け', 0, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'a', 2, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440002', 'b', 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440003', 'c', 3, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

-- 確認用クエリ
-- SELECT COUNT(*) FROM m_user;
-- SELECT COUNT(*) FROM t_score;
-- SELECT COUNT(*) FROM t_miss; 