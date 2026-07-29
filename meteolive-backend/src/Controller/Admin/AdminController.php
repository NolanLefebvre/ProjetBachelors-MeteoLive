<?php

namespace App\Controller\Admin;

use App\Entity\Note;
use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin')]
final class AdminController extends AbstractController
{
    #[Route('', name: 'api_admin_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json(['message' => 'Admin controller']);
    }

    #[Route('/utilisateurs', name: 'api_admin_utilisateurs', methods: ['GET'])]
    public function getUtilisateurs(EntityManagerInterface $em): JsonResponse
    {
        $utilisateurs = $em->getRepository(Utilisateur::class)->createQueryBuilder('u')
            ->where('u.roles NOT LIKE :role')
            ->setParameter('role', '%ROLE_ADMIN%')
            ->getQuery()
            ->getResult();
        $data = array_map(fn($u) => [
            'id' => $u->getId(),
            'pseudo' => $u->getPseudo(),
            'email' => $u->getEmail(),
            'roles' => $u->getRoles(),
            'dateInscription' => $u->getDateInscription()->format('Y-m-d H:i:s'),
        ], $utilisateurs);
        return $this->json($data);
    }

    #[Route('/utilisateurs/{id}', name: 'api_admin_utilisateurs_delete', methods: ['DELETE'])]
    public function deleteUtilisateur(int $id, EntityManagerInterface $em): JsonResponse
    {
        $utilisateur = $em->getRepository(Utilisateur::class)->find($id);
        if (!$utilisateur) {
            return $this->json(['message' => 'Utilisateur introuvable'], 404);
        }
        $em->remove($utilisateur);
        $em->flush();
        return $this->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    #[Route('/notes', name: 'api_admin_notes', methods: ['GET'])]
    public function getNotes(EntityManagerInterface $em): JsonResponse
    {
        $notes = $em->getRepository(Note::class)->findAll();
        $data = [];
        foreach ($notes as $n) {
            try {
                $data[] = [
                    'id' => $n->getId(),
                    'utilisateur' => $n->getUtilisateur()->getPseudo(),
                    'email' => $n->getUtilisateur()->getEmail(),
                    'ville' => $n->getVille()->getNom(),
                    'note' => $n->getNote(),
                    'date' => $n->getDate()->format('Y-m-d H:i:s'),
                ];
            } catch (\Exception $e) {
                continue;
            }
        }
        return $this->json($data);
    }

    #[Route('/notes/{id}', name: 'api_admin_notes_delete', methods: ['DELETE'])]
    public function deleteNote(int $id, EntityManagerInterface $em): JsonResponse
    {
        $note = $em->getRepository(Note::class)->find($id);
        if (!$note) {
            return $this->json(['message' => 'Note introuvable'], 404);
        }
        $em->remove($note);
        $em->flush();
        return $this->json(['message' => 'Note supprimée avec succès']);
    }
}