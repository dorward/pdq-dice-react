ALTER TABLE statistics_skill_checks ADD COLUMN IF NOT EXISTS characterId VARCHAR(40);
CREATE INDEX IF NOT EXISTS statistics_skill_checks_character_recent
    ON statistics_skill_checks (userId, characterId, eventTime DESC, id DESC);
