ALTER TABLE statistics_high_low ADD COLUMN IF NOT EXISTS characterId VARCHAR(40);
CREATE INDEX IF NOT EXISTS statistics_high_low_character_recent
    ON statistics_high_low (userId, characterId, eventTime DESC, id DESC);
