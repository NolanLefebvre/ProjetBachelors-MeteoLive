# 🌤️ MétéoLive

Application météo participative permettant aux utilisateurs de consulter la météo en temps réel, de noter leur ressenti et de consulter des classements météo mondiaux.

---

## 📋 Description

MétéoLive est une application web full-stack développée dans le cadre du Bachelor **Concepteur Développeur d'Applications (CDA)** à l'IPSSI.

L'application permet de :
- Consulter la météo actuelle et les prévisions sur 5 jours pour n'importe quelle ville du monde
- Noter son ressenti météo (note de 1 à 5) une fois par jour par ville
- Gérer une liste de villes favorites
- Consulter des classements (villes les plus chaudes, froides, venteuses, mieux notées)
- Choisir son unité de mesure (°C ou °F)
- Géolocalisation automatique par IP à l'arrivée sur l'application

**Stack technique :**
- 🔵 Back-end : **Symfony** (PHP) — API REST
- 🔴 Front-end : **Angular** (TypeScript) — SPA
- 🟢 Base de données : **MySQL**
- 🔐 Authentification : **JWT** (LexikJWTAuthenticationBundle)
- 🗺️ Carte : **Google Maps Embed**
- ☁️ Météo : **OpenWeatherMap API**
- 🐳 Déploiement : **Docker**

---

## 🚀 Installation et lancement

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- Un compte [OpenWeatherMap](https://openweathermap.org/api) pour obtenir une clé API gratuite

### Étapes

**1. Cloner le projet**
```bash
git clone https://github.com/NolanLefebvre/ProjetBachelors-MeteoLive.git
cd ProjetBachelors-MeteoLive/meteolive-backend
```

**2. Configurer les variables d'environnement**

Crée un fichier `.env` à la racine de `meteolive-backend/` en te basant sur `.env.example` :
```bash
cp .env.example .env
```

Remplis les valeurs suivantes dans `.env` :
```env
OPENWEATHER_API_KEY=ta_cle_api_openweather
JWT_PASSPHRASE=ta_passphrase_jwt
```

**3. Lancer Docker**
```bash
docker-compose up --build
```

> ⏳ Le premier lancement prend environ 5 à 10 minutes (téléchargement des images Docker, installation des dépendances, création des tables).

**4. Accéder à l'application**

| Service | URL |
|---|---|
| 🌐 Application Angular | http://localhost:4200 |
| 🔧 API Symfony | http://localhost:8000 |

---

## 🔄 Lancer l'application après le premier build

```bash
docker-compose up
```

---

## 🛑 Arrêter l'application

```bash
docker-compose down
```

> ⚠️ Pour supprimer les données de la base : `docker-compose down -v`

---

## 🗂️ Structure du projet

```
ProjetBachelors-MeteoLive/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD GitHub Actions
├── meteolive-backend/          # API Symfony
│   ├── src/
│   │   ├── Controller/         # Contrôleurs API REST
│   │   ├── Entity/             # Entités Doctrine
│   │   └── Repository/         # Repositories
│   ├── config/                 # Configuration Symfony
│   ├── migrations/             # Migrations Doctrine
│   ├── tests/                  # Tests unitaires PHPUnit
│   ├── Dockerfile
│   └── docker-compose.yml
└── meteolive-frontend/         # SPA Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/     # Composants Angular
    │   │   ├── services/       # Services HTTP
    │   │   ├── guards/         # Guards de navigation
    │   │   └── interceptors/   # Intercepteur JWT
    └── Dockerfile
```

---

## 🔐 Créer un compte administrateur

1. Inscris-toi via l'interface (`/inscription`)
2. Connecte-toi à la base de données MySQL Docker :
```bash
docker exec -it meteolive-backend-mysql-1 mysql -u root -proot meteolive
```
3. Exécute la requête suivante en remplaçant l'email :
```sql
UPDATE utilisateur SET roles = '["ROLE_ADMIN","ROLE_USER"]' WHERE email = 'ton@email.com';
```

---

## ✅ Lancer les tests unitaires

```bash
docker exec -it meteolive-backend-symfony-1 php bin/phpunit
```

---

## 🔑 Variables d'environnement requises

| Variable | Description |
|---|---|
| `OPENWEATHER_API_KEY` | Clé API OpenWeatherMap (gratuite) |
| `JWT_PASSPHRASE` | Passphrase pour les clés JWT |

---

## 📡 Principales routes API

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/register` | Inscription | ❌ |
| POST | `/api/login` | Connexion (retourne JWT) | ❌ |
| GET | `/api/meteo/{ville}` | Météo actuelle | ✅ |
| GET | `/api/meteo/{ville}/previsions` | Prévisions 5 jours | ✅ |
| GET | `/api/classements/meteo` | Classements météo | ✅ |
| GET | `/api/classements/ressenti` | Classements ressenti | ✅ |
| GET | `/api/me` | Profil utilisateur | ✅ |
| GET | `/api/me/favoris` | Liste des favoris | ✅ |
| POST | `/api/me/favoris` | Ajouter un favori | ✅ |
| DELETE | `/api/me/favoris/{id}` | Supprimer un favori | ✅ |
| POST | `/api/me/notes` | Noter une ville | ✅ |
| GET | `/api/admin/utilisateurs` | Liste des utilisateurs | 👑 Admin |
| DELETE | `/api/admin/utilisateurs/{id}` | Supprimer un utilisateur | 👑 Admin |
| GET | `/api/admin/notes` | Liste des notes | 👑 Admin |
| DELETE | `/api/admin/notes/{id}` | Supprimer une note | 👑 Admin |

---

## 🛡️ Sécurité

- Authentification **JWT** avec expiration automatique
- **Rate limiting** sur le login (5 tentatives/minute)
- Hashage des mots de passe avec **bcrypt**
- Protection **XSS** native Angular
- Protection **injection SQL** via Doctrine ORM
- **CORS** configuré avec NelmioCorsBundle
- Intercepteur HTTP côté Angular pour la gestion des tokens expirés




