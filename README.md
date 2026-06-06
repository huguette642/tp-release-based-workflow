# tp-release-based-workflow

API NestJS minimaliste — support du TP 3 cours-03 (Release-Based Workflow).

---

## Branches du projet

| Branche | Rôle |
|---|---|
| `main` | Ligne d'intégration de la prochaine version |
| `release/v1.0` | Version majeure 1.0 maintenue |
| `release/v2.0` | Version majeure 2.0 maintenue ou en stabilisation |
| `feature/...` | Développement d'une fonctionnalité → fusionne dans `main` |
| `hotfix/...` | Correctif urgent → fusionne dans la branche `release/...` concernée, puis est reporté sur les autres lignes concernées |

> Détail des règles et cycles de vie → [BRANCHES.md](BRANCHES.md)

---

## Contexte des Pull Requests en TP

Par défaut, les Pull Requests sont ouvertes **dans ton fork** : par exemple `hotfix/fix-title-validation` est proposée vers `release/v1.0` de ton dépôt forké.

Si l'enseignant le demande explicitement, la Pull Request peut viser le dépôt central `GVI2026/tp-release-based-workflow`. Sans droit d'écriture ou sans accès GitHub disponible, le scénario peut être simulé localement avec les merges et `cherry-pick` indiqués dans ce README, en gardant la même logique de revue et de validation.

---

## Démarrage recommandé — DevContainer (Windows / Linux / macOS)

**Prérequis** : [VS Code](https://code.visualstudio.com/) + [Docker Desktop](https://www.docker.com/products/docker-desktop/) + extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. **Forker** le dépôt sur GitHub, puis le cloner :
   ```bash
   git clone <url-de-ton-fork>
   cd tp-release-based-workflow
   ```

2. Ouvrir dans VS Code et accepter "Reopen in Container" — ou via la palette de commandes : `Dev Containers: Reopen in Container`

3. Attendre l'initialisation (première fois ~2 min). Les dépendances npm et les migrations Prisma s'exécutent automatiquement.

4. Lancer l'application :
   ```bash
   npm run start:dev
   ```

5. Swagger disponible sur [http://localhost:3000/api](http://localhost:3000/api)

---

## Démarrage manuel (sans DevContainer)

**Prérequis** : Node.js 24, PostgreSQL 18

1. Copier et renseigner les variables d'environnement :
   ```bash
   cp .env.example .env
   # Éditer .env : renseigner DATABASE_URL
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Appliquer les migrations :
   ```bash
   npx prisma migrate dev --name init
   ```

4. Lancer l'application :
   ```bash
   npm run start:dev
   ```

---

## Lancer les tests

```bash
npm test
```

---

## Routes disponibles

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/tasks` | Créer une tâche |
| `GET` | `/tasks` | Lister toutes les tâches |
| `GET` | `/tasks/:id` | Récupérer une tâche |
| `PATCH` | `/tasks/:id` | Mettre à jour une tâche |
| `DELETE` | `/tasks/:id` | Supprimer une tâche |
| `GET` | `/tasks/stats` | **À implémenter sur la prochaine version** — `{ total, done, pending }` |

---

## Scénario Release-Based Workflow

### Étape 0 — Mise en place

1. **Forker** le dépôt sur GitHub, puis le cloner.
2. Vérifier que les trois branches permanentes existent :
   ```bash
   git branch -a
   ```
   Tu dois voir `main`, `origin/release/v1.0` et `origin/release/v2.0`.
3. Se placer sur `main` :
   ```bash
   git checkout main
   ```

### Étape 1 — Ajouter une fonctionnalité pour la prochaine version

4. Créer la branche de fonctionnalité depuis `main` :
   ```bash
   git checkout -b feature/add-task-stats
   ```
5. Implémenter `GET /tasks/stats` dans `TasksService` et `TasksController`.
6. Décommenter le bloc `TODO` dans `tasks.service.spec.ts` et l'adapter.
7. Vérifier que tous les tests passent :
   ```bash
   npm test
   ```
8. Committer proprement :
   ```bash
   git add .
   git commit -m "feat: add task stats endpoint"
   ```
9. Pousser la branche et ouvrir une Pull Request vers `main`.

### Étape 2 — Stabiliser la version majeure 2

Dans un Release-Based Workflow, une version majeure peut être figée dans une branche dédiée pendant que `main` continue à préparer la suite.

10. Une fois la fonctionnalité intégrée dans `main`, créer ou mettre à jour `release/v2.0` depuis `main` :
    ```bash
    git checkout main
    git pull
    git checkout release/v2.0
    git merge main
    ```
11. Vérifier que `release/v2.0` contient la fonctionnalité `/tasks/stats`.
12. Mettre à jour `VERSION` si nécessaire :
    ```text
    2.0.0
    ```
13. Committer la stabilisation si un fichier a changé :
    ```bash
    git add VERSION
    git commit -m "chore: prepare release 2.0.0"
    ```

### Étape 3 — Corriger un bug urgent sur la version 1.0

La validation du champ `title` est volontairement incomplète : un `POST /tasks` avec `{ "title": "" }` accepte une chaîne vide.

14. Basculer sur la branche de release v1.0 :
    ```bash
    git checkout release/v1.0
    ```
15. Créer une branche de correctif depuis cette release :
    ```bash
    git checkout -b hotfix/fix-title-validation
    ```
16. Corriger le problème dans `CreateTaskDto`.
17. Ajouter ou adapter un test qui vérifie que le titre vide est rejeté.
18. Vérifier que tous les tests passent :
    ```bash
    npm test
    ```
19. Committer proprement :
    ```bash
    git add .
    git commit -m "fix: reject empty task title"
    ```
20. Pousser la branche et ouvrir une Pull Request vers `release/v1.0`.

### Étape 4 — Reporter le correctif sur les versions parallèles

Un correctif critique ne doit pas rester isolé sur `release/v1.0` si le même bug existe aussi dans `release/v2.0` ou dans `main`.

21. Noter le SHA du commit de hotfix, puis le reporter sur `release/v2.0` :
    ```bash
    git checkout release/v2.0
    git cherry-pick <sha-du-commit-hotfix>
    ```
22. Vérifier les tests, puis pousser `release/v2.0`.
23. Reporter aussi le correctif sur `main` si le bug existe dans la ligne d'intégration :
    ```bash
    git checkout main
    git cherry-pick <sha-du-commit-hotfix>
    ```
24. Vérifier que `release/v1.0`, `release/v2.0` et `main` contiennent toutes le correctif attendu.

---

## Pour les plus rapides — Exercice optionnel validé

Après avoir terminé le scénario principal, traite un **second correctif mineur** sur `release/v1.0`, puis reporte-le également sur `release/v2.0` et `main`.

L'objectif du bonus n'est pas d'ajouter une nouvelle notion, mais de renforcer l'idée centrale du Release-Based Workflow : plusieurs versions livrables impliquent parfois plusieurs corrections coordonnées.

Tu peux par exemple :

- corriger un second bug simple sur `release/v1.0`,
- le commit en `fix: ...`,
- puis le reporter proprement avec `cherry-pick`.

---

## Note de setup — enseignant

Avant la séance, s'assurer que :

- Les branches `release/v1.0` et `release/v2.0` existent et sont poussées.
- `main` représente la ligne d'intégration de la prochaine version.
- `release/v1.0` représente une version majeure déjà livrée et encore maintenue.
- `release/v2.0` représente une version majeure en stabilisation ou déjà livrée.
- `main`, `release/v1.0` et `release/v2.0` sont protégées : Pull Request obligatoire, CI verte avant merge.
- `npm test` est vert sur un dépôt fraîchement cloné.
- Les tags ou releases GitHub peuvent être préparés avec `v1.0.0` et `v2.0.0` pour matérialiser les versions majeures.

Pour que le TP soit parlant, préparer un historique simple montrant que `release/v1.0` et `release/v2.0` sont deux lignes différentes, mais que certains correctifs doivent rester alignés entre elles.
