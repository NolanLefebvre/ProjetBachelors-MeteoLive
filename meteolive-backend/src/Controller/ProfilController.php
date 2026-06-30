<?php

namespace App\Controller;

use App\Entity\Favori;
use App\Entity\Ville;
use App\Entity\Note;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/me')]
class ProfilController extends AbstractController
{
    #[Route('/favoris', name: 'api_favoris_list', methods: ['GET'])]
    public function getFavoris(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        $favoris = $em->getRepository(Favori::class)->findBy(['utilisateur' => $user]);

        $data = array_map(function (Favori $favori) {
            return [
                'id' => $favori->getId(),
                'ville' => $favori->getVille()->getNom(),
                'pays' => $favori->getVille()->getPays(),
            ];
        }, $favoris);

        return $this->json($data);
    }

    #[Route('/favoris', name: 'api_favoris_add', methods: ['POST'])]
    public function addFavori(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (empty($data['nomVille'])) {
            return $this->json(['message' => 'Le nom de la ville est obligatoire'], 400);
        }

        $ville = $em->getRepository(Ville::class)->findOneBy(['nom' => $data['nomVille']]);

        if (!$ville) {
            return $this->json(['message' => 'Ville introuvable, consultez d\'abord la météo de cette ville'], 404);
        }

        $existingFavori = $em->getRepository(Favori::class)->findOneBy([
            'utilisateur' => $user,
            'ville' => $ville
        ]);

        if ($existingFavori) {
            return $this->json(['message' => 'Cette ville est déjà dans vos favoris'], 409);
        }

        $favori = new Favori();
        $favori->setUtilisateur($user);
        $favori->setVille($ville);

        $em->persist($favori);
        $em->flush();

        return $this->json([
            'message' => 'Favori ajouté avec succès',
            'favori' => [
                'id' => $favori->getId(),
                'ville' => $ville->getNom(),
                'pays' => $ville->getPays(),
            ]
        ], 201);
    }

    #[Route('/favoris/{id}', name: 'api_favoris_delete', methods: ['DELETE'])]
    public function deleteFavori(
        int $id,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();

        $favori = $em->getRepository(Favori::class)->findOneBy([
            'id' => $id,
            'utilisateur' => $user
        ]);

        if (!$favori) {
            return $this->json(['message' => 'Favori introuvable'], 404);
        }

        $em->remove($favori);
        $em->flush();

        return $this->json(['message' => 'Favori supprimé avec succès']);
    }

    #[Route('/notes', name: 'api_notes_list', methods: ['GET'])]
        public function getNotes(EntityManagerInterface $em): JsonResponse
        {
            $user = $this->getUser();

            $notes = $em->getRepository(Note::class)->findBy(
                ['utilisateur' => $user],
                ['date' => 'DESC']
            );

            $data = array_map(function (Note $note) {
                return [
                    'id' => $note->getId(),
                    'ville' => $note->getVille()->getNom(),
                    'pays' => $note->getVille()->getPays(),
                    'note' => $note->getNote(),
                    'date' => $note->getDate()->format('Y-m-d H:i:s'),
                ];
            }, $notes);

            return $this->json($data);
        }
    #[Route('/notes', name: 'api_notes_add', methods: ['POST'])]
    public function addNote(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (empty($data['nomVille']) || !isset($data['note'])) {
            return $this->json(['message' => 'Le nom de la ville et la note sont obligatoire'], 400);
        }
         if ($data['note'] < 1 || $data['note'] > 5) {
        return $this->json(['message' => 'La note doit être entre 1 et 5'], 400);
        }
        $ville = $em->getRepository(Ville::class)->findOneBy(['nom' => $data['nomVille']]);

        if (!$ville) {
            return $this->json(['message' => 'Ville introuvable, consultez d\'abord la météo de cette ville'], 404);
        }

        $timezone = new \DateTimeZone('Europe/Paris');
        $aujourdhui = new \DateTime('now', $timezone);
        $aujourdhui->setTime(0, 0, 0);
        $demain = (clone $aujourdhui)->modify('+1 day');

        $existingNote = $em->getRepository(Note::class)->createQueryBuilder('n')
            ->where('n.utilisateur = :user')
            ->andWhere('n.ville = :ville')
            ->andWhere('n.date >= :aujourdhui')
            ->andWhere('n.date < :demain')
            ->setParameter('user', $user)
            ->setParameter('ville', $ville)
            ->setParameter('aujourdhui', $aujourdhui)
            ->setParameter('demain', $demain)
            ->getQuery()
            ->getOneOrNullResult();

        if ($existingNote) {
            return $this->json(['message' => 'Vous avez deja noté cette ville'], 409);
        }

        $note = new Note();
        $note->setUtilisateur($user);
        $note->setVille($ville);
        $note->setNote($data['note']);
        $note->setDate(new \DateTime());

        $em->persist($note);
        $em->flush();

        return $this->json([
            'message' => 'Note ajoutée avec succès',
            'note' => [
                'id' => $note->getId(),
                'ville' => $ville->getNom(),
                'note' => $note->getNote(),
                'date' => $note->getDate()->format('Y-m-d H:i:s'),
            ]
        ], 201);
    }

    #[Route('/notes/{id}', name: 'api_notes_delete', methods: ['DELETE'])]
    public function deleteNotes(
        int $id,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();

        $note = $em->getRepository(Note::class)->findOneBy([
            'id' => $id,
            'utilisateur' => $user
        ]);

        if (!$note) {
            return $this->json(['message' => 'Note introuvable'], 404);
        }

        $em->remove($note);
        $em->flush();

        return $this->json(['message' => 'Note supprimé avec succès']);
    }
    #[Route('', name: 'api_me', methods: ['GET'])]
        public function getProfil(): JsonResponse
        {
            $user = $this->getUser();
                return $this->json( [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'pseudo' => $user->getPseudo(),
                    'roles' => $user->getRoles(),
                    'dateInscription' => $user->getDateInscription()->format('Y-m-d H:i:s'),
                    'villeDefaut' => $user->getVilleDefaut() ? $user->getVilleDefaut()->getNom() : null,
                ]);
        }
    #[Route('', name: 'api_me_delete', methods: ['DELETE'])]
    public function deleteProfile(EntityManagerInterface $em): JsonResponse {
        $user = $this->getUser();
        $em->remove($user);
        $em->flush();

        return $this->json(['message' => 'Note supprimé avec succès']);
    }

    #[Route('/ville-defaut', name: 'api_me_ville_defaut', methods: ['PUT'])]
    public function updateVilleDefaut(Request $request,EntityManagerInterface $em): JsonResponse {
    $user = $this->getUser();
    $data = json_decode($request->getContent(), true);

    if (!$data['nomVille']) {
        return $this->json(['message' => 'Le nom de la ville est obligatoire'], 400);
    }
    $ville = $em->getRepository(Ville::class)->findOneBy(['nom' => $data['nomVille']]);
    if (!$ville) {
        return $this->json(['message' => 'La ville est introuvable, consultez d\'abord la météo de cette ville'], 400);
    }
    $user->setVilleDefaut($ville);
    $em->flush();

    return $this->json(['message' => 'La ville par défaut a été mise a jour']);
    }

    #[Route('/unite', name: 'api_me_unite', methods: ['PUT'])]
    public function updateUnite(Request $request,EntityManagerInterface $em): JsonResponse {
    $user = $this->getUser();
    $data = json_decode($request->getContent(), true);

    if (!$data['unite']) {
        return $this->json(['message' => 'L\'unité est obligatoire'], 400);
    }
    if (!in_array($data['unite'], ['celsius', 'fahrenheit'])) {
        return $this->json(['message' => 'L\'unité doit être celsius ou fahrenheit'], 400);
    }
    $user->setUnite($data['unite']);
    $em->flush();

    return $this->json(['message' => 'Unité mise a jour']);
    }
}