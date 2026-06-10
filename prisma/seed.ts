import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: 'Rédiger les spécifications du module de facturation',
        content: 'Décrire les cas nominaux et les cas limites avant le sprint review',
        done: false,
      },
      {
        title: 'Corriger le bug de calcul de TVA',
        content: 'Le taux appliqué est incorrect pour les clients hors UE',
        done: true,
      },
      {
        title: 'Ajouter la validation des formulaires de saisie',
        content: 'Les champs obligatoires ne sont pas encore vérifiés côté serveur',
        done: false,
      },
      {
        title: 'Mettre à jour la documentation Swagger',
        content: null,
        done: false,
      },
      {
        title: 'Préparer la release v1.0.0',
        content: 'Vérifier le changelog, les tags et la note de release',
        done: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Base de données initialisée avec les données placeholder ✓')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
