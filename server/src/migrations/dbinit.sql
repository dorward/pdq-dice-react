CREATE TABLE IF NOT EXISTS user_data (
		userId VARCHAR(40),
		data jsonb,
        CONSTRAINT userId_pkey PRIMARY KEY (userId)
);
