
CREATE TABLE IF NOT EXISTS statistics_skill_checks (
        id SERIAL,
        eventTime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		characterName VARCHAR(80) NOT NULL,
        description VARCHAR(200) NOT NULL,
        bonus SMALLINT NOT NULL,
        roll SMALLINT NOT NULL,
        total SMALLINT NOT NULL,
        CONSTRAINT statistics_skill_checks_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS statistics_high_low (
        id SERIAL,
        eventTime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		characterName VARCHAR(80) NOT NULL,
        seekingHigh BOOLEAN NOT NULL,
        success BOOLEAN NOT NULL,
        roll SMALLINT NOT NULL,
        CONSTRAINT statistics_high_low_pkey PRIMARY KEY (id)
);