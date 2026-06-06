# Branches du projet

Ce tableau résume les règles de Release-Based Workflow retenues dans ce dépôt.

| Branche | Rôle | Contexte de diffusion | Part de | Fusionne dans |
|---|---|---|---|---|
| `main` | Ligne d'intégration de la prochaine version | développement courant | — | — |
| `release/v1.0` | Version majeure 1.0 maintenue | livrable v1 pour clients/audit/support | historique préparé avant la séance | — |
| `release/v2.0` | Version majeure 2.0 maintenue ou en stabilisation | livrable v2 pour clients/audit/support | `main` au moment du gel de version | — |
| `feature/...` | Nouvelle fonctionnalité pour la prochaine version | future release | `main` | `main` |
| `hotfix/...` | Correctif urgent pour une version maintenue | correctif de release | branche `release/...` concernée | cette `release/...`, puis report sur les autres lignes concernées |

## Règles

- On ne développe **jamais directement** sur `main`.
- On ne développe **jamais directement** sur `release/v1.0` ou `release/v2.0`.
- Une nouvelle fonctionnalité part toujours de `main`.
- Une branche `release/x.y` représente un livrable figé ou stabilisé.
- Un correctif urgent part de la branche `release/...` où le bug doit être corrigé en premier.
- Lorsqu'un bug existe sur plusieurs versions maintenues, le correctif doit être **reporté** sur chaque ligne concernée, généralement avec `cherry-pick`.

## Cycle de vie d'une feature pour la prochaine version

```text
main
  └─ feature/ma-fonctionnalite
       └─ (commits)
main ← merge feature
release/v2.0 ← merge main au moment du gel ou de la stabilisation
```

## Cycle de vie d'un hotfix sur une release maintenue

```text
release/v1.0
  └─ hotfix/fix-mon-bug
       └─ (correctif)
release/v1.0 ← merge hotfix
release/v2.0 ← cherry-pick du correctif si le bug existe aussi en v2
main         ← cherry-pick du correctif si le bug existe aussi sur la ligne courante
```

## Pourquoi ce flow est intéressant ici

Ce dépôt sert à montrer qu'un projet peut devoir :

- fournir des livrables distincts à des clients différents,
- figer une version pour audit ou certification,
- maintenir deux versions majeures en conditions opérationnelles,
- coordonner les reports de correctifs entre plusieurs lignes,
- accepter un coût Git plus élevé qu'un flow à ligne unique.
