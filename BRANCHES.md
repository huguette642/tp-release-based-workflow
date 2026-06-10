# Branches du projet

Ce tableau résume les règles de Release-Based Workflow retenues dans ce dépôt.

| Branche | Rôle | Contexte de diffusion | Part de | Fusionne dans |
|---|---|---|---|---|
| `main` | Ligne d'intégration de la prochaine version | développement courant | — | — |
| `release/v1.0` | Version 1.0 maintenue | livrable v1 pour clients/audit/support | historique préparé avant la séance | — |
| `release/v1.1` | Version 1.1 en stabilisation | livrable suivant | `main` au moment du gel de version | — |
| `feature/...` | Nouvelle fonctionnalité pour la prochaine version | future release | `main` | `main` |
| `hotfix/...` | Correctif urgent pour une version maintenue | correctif de release | branche `release/...` concernée | cette `release/...`, puis report sur les autres lignes concernées |

## Règles

- On ne développe **jamais directement** sur `main`.
- On ne développe **jamais directement** une nouvelle fonctionnalité sur `release/v1.0` ou `release/v1.1`.
- Une nouvelle fonctionnalité part toujours de `main`.
- Une branche `release/x.y` représente un livrable figé ou stabilisé : c'est un sanctuaire de recette, de stabilisation et de hotfix.
- Un correctif urgent part de la branche `release/...` où le bug doit être corrigé en premier.
- Lorsqu'un bug existe sur plusieurs versions maintenues, le correctif doit être **reporté** sur chaque ligne concernée, généralement avec `cherry-pick`.

## Cycle de vie d'une feature pour la prochaine version

```text
main
  └─ feature/ma-fonctionnalite
       └─ (commits)
main ← merge feature
release/v1.1 ← création depuis main au moment du gel ou de la stabilisation
```

## Cycle de vie d'un hotfix sur une release maintenue

```text
release/v1.0
  └─ hotfix/fix-mon-bug
       └─ (correctif)
release/v1.0 ← merge hotfix
main         ← cherry-pick du correctif si le bug existe aussi sur la ligne courante
release/v1.1 ← cherry-pick du correctif si le bug existe aussi dans la version stabilisée
```

## Pourquoi ce flow est intéressant ici

Ce dépôt sert à montrer qu'un projet peut devoir :

- fournir des livrables distincts à des clients différents,
- figer une version pour audit ou certification,
- maintenir une version livrée pendant que la suivante est stabilisée,
- coordonner les reports de correctifs entre plusieurs lignes,
- accepter un coût Git plus élevé qu'un flow à ligne unique.
