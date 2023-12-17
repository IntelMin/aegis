CREATE TABLE aegis (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    whitelisted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE audit_requests (
    request_id SERIAL PRIMARY KEY,
    contract VARCHAR(255) NOT NULL UNIQUE,
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
    contract VARCHAR(255) NOT NULL,
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

CREATE TRIGGER update_token_audits_modtime
BEFORE UPDATE ON token_audits
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();