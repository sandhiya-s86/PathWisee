-- ============================================================
-- PathWise MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS pathwise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pathwise;

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id           VARCHAR(36)  NOT NULL,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    academic_stage VARCHAR(100),
    stream       VARCHAR(100),
    is_admin     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at   DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User skills array → junction table
CREATE TABLE IF NOT EXISTS user_skills (
    user_id VARCHAR(36)  NOT NULL,
    skill   VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CAREERS
-- ============================================================

CREATE TABLE IF NOT EXISTS careers (
    id                 VARCHAR(36)  NOT NULL,
    name               VARCHAR(255) NOT NULL,
    description        TEXT,
    icon               VARCHAR(100),
    salary_range       VARCHAR(255),
    education_required VARCHAR(500),
    created_at         DATETIME     NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- skills_required array → junction table
CREATE TABLE IF NOT EXISTS career_skills_required (
    career_id VARCHAR(36)  NOT NULL,
    skill     VARCHAR(255) NOT NULL,
    PRIMARY KEY (career_id, skill),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- academic_stages array → junction table
CREATE TABLE IF NOT EXISTS career_academic_stages (
    career_id VARCHAR(36) NOT NULL,
    stage     VARCHAR(100) NOT NULL,
    PRIMARY KEY (career_id, stage),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- streams array → junction table
CREATE TABLE IF NOT EXISTS career_streams (
    career_id VARCHAR(36) NOT NULL,
    stream    VARCHAR(100) NOT NULL,
    PRIMARY KEY (career_id, stream),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ASSESSMENT QUESTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS questions (
    id            VARCHAR(36) NOT NULL,
    text          TEXT        NOT NULL,
    display_order INT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS question_options (
    id            VARCHAR(36) NOT NULL,
    question_id   VARCHAR(36) NOT NULL,
    text          TEXT        NOT NULL,
    display_order INT         NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Career weights per option (stores the scoring weights)
CREATE TABLE IF NOT EXISTS question_option_career_weights (
    option_id VARCHAR(36) NOT NULL,
    career_id VARCHAR(36) NOT NULL,
    weight    FLOAT       NOT NULL,
    PRIMARY KEY (option_id, career_id),
    FOREIGN KEY (option_id) REFERENCES question_options(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- LEARNING PATHS & MILESTONES
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_paths (
    id        VARCHAR(36) NOT NULL,
    career_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_lp_career (career_id),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS milestones (
    id               VARCHAR(36)  NOT NULL,
    learning_path_id VARCHAR(36)  NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    duration         VARCHAR(100),
    display_order    INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ASSESSMENT RESULTS
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_results (
    id        VARCHAR(36) NOT NULL,
    user_id   VARCHAR(36) NOT NULL,
    timestamp DATETIME    NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ar_user_ts (user_id, timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Which option the user chose per question
CREATE TABLE IF NOT EXISTS assessment_responses (
    result_id   VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    option_id   VARCHAR(36) NOT NULL,
    PRIMARY KEY (result_id, question_id),
    FOREIGN KEY (result_id) REFERENCES assessment_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Computed top-5 career recommendations stored with the result
CREATE TABLE IF NOT EXISTS assessment_recommendations (
    result_id    VARCHAR(36)  NOT NULL,
    career_id    VARCHAR(36)  NOT NULL,
    career_name  VARCHAR(255),
    score        FLOAT,
    description  TEXT,
    icon         VARCHAR(100),
    rank_order   INT          NOT NULL,
    PRIMARY KEY (result_id, career_id),
    FOREIGN KEY (result_id) REFERENCES assessment_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- USER PROGRESS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_progress (
    id         VARCHAR(36) NOT NULL,
    user_id    VARCHAR(36) NOT NULL,
    career_id  VARCHAR(36) NOT NULL,
    started_at DATETIME    NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_up_user_career (user_id, career_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- completed_milestones array → junction table
CREATE TABLE IF NOT EXISTS user_progress_milestones (
    progress_id  VARCHAR(36) NOT NULL,
    milestone_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (progress_id, milestone_id),
    FOREIGN KEY (progress_id) REFERENCES user_progress(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ROADMAPS  (currently empty — stored as JSON blob)
-- ============================================================

CREATE TABLE IF NOT EXISTS roadmaps (
    id        VARCHAR(36) NOT NULL,
    career_id VARCHAR(36),
    content   JSON,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roadmaps_career (career_id),
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ENTRANCE EXAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS entrance_exams (
    id       VARCHAR(36)  NOT NULL,
    name     VARCHAR(255),
    category VARCHAR(100),
    data     JSON,
    PRIMARY KEY (id),
    INDEX idx_exams_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exam_career_relations (
    exam_id   VARCHAR(36) NOT NULL,
    career_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (exam_id, career_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COLLEGES
-- ============================================================

CREATE TABLE IF NOT EXISTS colleges (
    id    VARCHAR(36)  NOT NULL,
    name  VARCHAR(255),
    state VARCHAR(100),
    data  JSON,
    PRIMARY KEY (id),
    INDEX idx_colleges_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS college_exam_relations (
    college_id VARCHAR(36) NOT NULL,
    exam_id    VARCHAR(36) NOT NULL,
    PRIMARY KEY (college_id, exam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS college_career_relations (
    college_id VARCHAR(36) NOT NULL,
    career_id  VARCHAR(36) NOT NULL,
    PRIMARY KEY (college_id, career_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SKILLS CATALOGUE  (future use)
-- ============================================================

CREATE TABLE IF NOT EXISTS skills (
    id   VARCHAR(36)  NOT NULL,
    name VARCHAR(255) NOT NULL,
    data JSON,
    PRIMARY KEY (id),
    UNIQUE KEY uq_skills_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
