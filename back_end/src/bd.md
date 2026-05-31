CREATE DATABASE IF NOT EXISTS iut_gate
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iut_gate;

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
  id_admin           INT AUTO_INCREMENT PRIMARY KEY,
  nom                VARCHAR(100) NOT NULL,
  email              VARCHAR(100) NOT NULL UNIQUE,
  mot_de_passe       VARCHAR(255) NOT NULL,
  reset_token        VARCHAR(255) NULL,
  reset_token_expiry DATETIME    NULL,
  createdAt          DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- BÂTIMENTS
CREATE TABLE IF NOT EXISTS batiments (
  id_batiment INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  description TEXT,
  latitude    FLOAT,
  longitude   FLOAT,
  photo_url   VARCHAR(255),
  id_admin    INT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_admin) REFERENCES admins(id_admin) ON DELETE SET NULL
);

-- DÉPARTEMENTS
CREATE TABLE IF NOT EXISTS departements (
  id_departement INT AUTO_INCREMENT PRIMARY KEY,
  nom            VARCHAR(100) NOT NULL,
  description    TEXT,
  photo_url      VARCHAR(255),
  id_admin       INT,
  createdAt      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_admin) REFERENCES admins(id_admin) ON DELETE SET NULL
);

-- FILIÈRES
CREATE TABLE IF NOT EXISTS filieres (
  id_filiere          INT AUTO_INCREMENT PRIMARY KEY,
  nom                 VARCHAR(100) NOT NULL,
  description         TEXT,
  duree               VARCHAR(20),
  condition_admission TEXT,
  places              INT,
  photo_url           VARCHAR(255),
  id_departement      INT,
  id_admin            INT,
  createdAt           DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_departement) REFERENCES departements(id_departement) ON DELETE SET NULL,
  FOREIGN KEY (id_admin)       REFERENCES admins(id_admin)             ON DELETE SET NULL
);

-- ENSEIGNANTS
CREATE TABLE IF NOT EXISTS staff_enseignants (
  id_enseignant      INT AUTO_INCREMENT PRIMARY KEY,
  nom                VARCHAR(100) NOT NULL,
  telephone          VARCHAR(20),
  email              VARCHAR(100),
  poste              VARCHAR(100),
  role               VARCHAR(100),
  bureau             VARCHAR(100),
  coordonnees_bureau VARCHAR(100),
  photo_url          VARCHAR(255),
  id_departement     INT,
  id_batiment        INT,
  id_admin           INT,
  createdAt          DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_departement) REFERENCES departements(id_departement) ON DELETE SET NULL,
  FOREIGN KEY (id_batiment)    REFERENCES batiments(id_batiment)       ON DELETE SET NULL,
  FOREIGN KEY (id_admin)       REFERENCES admins(id_admin)             ON DELETE SET NULL
);

-- FILIÈRE ↔ ENSEIGNANT (Many-to-Many)
CREATE TABLE IF NOT EXISTS filiere_enseignants (
  id_filiere    INT NOT NULL,
  id_enseignant INT NOT NULL,
  PRIMARY KEY (id_filiere, id_enseignant),
  FOREIGN KEY (id_filiere)    REFERENCES filieres(id_filiere)           ON DELETE CASCADE,
  FOREIGN KEY (id_enseignant) REFERENCES staff_enseignants(id_enseignant) ON DELETE CASCADE
);

-- SALLES
CREATE TABLE IF NOT EXISTS salles (
  id_salle    INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  capacite    INT,
  type        VARCHAR(100),
  id_batiment INT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_batiment) REFERENCES batiments(id_batiment) ON DELETE SET NULL
);

-- SERVICES ADMINISTRATIFS
CREATE TABLE IF NOT EXISTS services_administratifs (
  id_service  INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  description TEXT,
  contact     VARCHAR(100),
  id_batiment INT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_batiment) REFERENCES batiments(id_batiment) ON DELETE SET NULL
);

-- ACTUALITÉS
CREATE TABLE IF NOT EXISTS actualites (
  id_actualite     INT AUTO_INCREMENT PRIMARY KEY,
  titre            VARCHAR(255) NOT NULL,
  contenu          TEXT         NOT NULL,
  categorie        VARCHAR(50)  DEFAULT 'Général',
  photo_url        VARCHAR(255),
  date_publication DATETIME     DEFAULT CURRENT_TIMESTAMP,
  id_admin         INT,
  createdAt        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_admin) REFERENCES admins(id_admin) ON DELETE SET NULL
);

-- PHOTOS ACTUALITÉS
CREATE TABLE IF NOT EXISTS actualite_photos (
  id_photo     INT AUTO_INCREMENT PRIMARY KEY,
  id_actualite INT NOT NULL,
  url          VARCHAR(255) NOT NULL,
  ordre        INT          DEFAULT 0,
  createdAt    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_actualite) REFERENCES actualites(id_actualite) ON DELETE CASCADE
);