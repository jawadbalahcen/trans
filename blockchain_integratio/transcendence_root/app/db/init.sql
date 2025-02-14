DO $$
BEGIN
    -- Create user if not exists
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'smbarki') THEN
        CREATE USER smbarki WITH PASSWORD 'saadmbarki';
    END IF;
    
    -- Grant privileges
    ALTER USER smbarki CREATEDB;
    GRANT ALL PRIVILEGES ON DATABASE sabdark TO smbarki;
END
$$; 