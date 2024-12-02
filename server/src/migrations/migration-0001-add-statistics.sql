CREATE TABLE IF NOT EXISTS
    statistics_skill_checks (
        id SERIAL,
        userId VARCHAR(40) NOT NULL,
        eventTime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        characterName VARCHAR(80) NOT NULL,
        description VARCHAR(200) NOT NULL,
        bonus SMALLINT NOT NULL,
        bonuses jsonb,
        roll SMALLINT NOT NULL,
        total SMALLINT NOT NULL,
        benny boolean,
        CONSTRAINT statistics_skill_checks_pkey PRIMARY KEY (id),
        CONSTRAINT statistics_skill_checks_userId FOREIGN KEY (userId) REFERENCES user_data (userId) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    statistics_high_low (
        id SERIAL,
        userId VARCHAR(40) NOT NULL,
        eventTime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        characterName VARCHAR(80) NOT NULL,
        seekingHigh BOOLEAN NOT NULL,
        success BOOLEAN NOT NULL,
        roll SMALLINT NOT NULL,
        CONSTRAINT statistics_high_low_pkey PRIMARY KEY (id),
        CONSTRAINT statistics_high_low_userId FOREIGN KEY (userId) REFERENCES user_data (userId) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    statistics_d6 (
        id SERIAL,
        userId VARCHAR(40) NOT NULL,
        eventTime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        characterName VARCHAR(80) NOT NULL,
        roll SMALLINT NOT NULL,
        CONSTRAINT statistics_d6_pkey PRIMARY KEY (id),
        CONSTRAINT statistics_d6_userId FOREIGN KEY (userId) REFERENCES user_data (userId) ON UPDATE CASCADE ON DELETE CASCADE
    );