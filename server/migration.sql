CREATE TABLE aegis (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    whitelisted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE audit_requests (
    request_id SERIAL PRIMARY KEY,
    contract TEXT NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'partial', 'completed', 'failed')),
    status_log TEXT,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audit_requests_modtime
BEFORE UPDATE ON audit_requests
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TABLE token_audits (
    audit_id SERIAL PRIMARY KEY,
    contract TEXT NOT NULL,
    score_health NUMERIC(5, 2),
    score_security NUMERIC(5, 2),
    score_strength NUMERIC(5, 2),
    score_total NUMERIC(5, 2),
    findings_low INTEGER DEFAULT 0,
    findings_medium INTEGER DEFAULT 0,
    findings_high INTEGER DEFAULT 0,
    findings_critical INTEGER DEFAULT 0,
    findings_total INTEGER DEFAULT 0,
    audit_loc INTEGER,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    project_name TEXT NULL,
    website TEXT NULL,
    token_address TEXT NULL,
    tele_account TEXT NULL,
    project_x TEXT NULL,
    project_insta TEXT NULL,
    role TEXT NULL,
    name TEXT NULL,
    twitter TEXT NULL,
    tele_id TEXT NULL,
    about TEXT NULL,
    vc_contact_name TEXT NULL,
    vc_email TEXT NULL,
    project_email TEXT NULL,
    logo_url TEXT,
    is_checked BOOLEAN NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN NULL DEFAULT false,
    whitelisted BOOLEAN NULL DEFAULT false
);
CREATE TABLE report_requests(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    address TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NULL,
    link TEXT NULL
     
);
CREATE TABLE tg_users(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    userid INTEGER NOT NULL,
    chatid INTEGER NOT NULL,
    subscribed BOOLEAN NULL DEFAULT false
);

CREATE TRIGGER update_token_audits_modtime
BEFORE UPDATE ON token_audits
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TABLE paid_users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    paid_token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
