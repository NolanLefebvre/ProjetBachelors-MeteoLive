<?php

namespace App\Controller;

use App\Entity\Meteo;
use App\Entity\Note;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/classements')]
class ClassementController extends AbstractController
{
    #[Route('/meteo', name: 'api_classements_meteo', methods: ['GET'])]
    public function getClassementMeteo(EntityManagerInterface $em): JsonResponse
    {
        // On ne récupère que les météos non expirées
        $meteos = $em->getRepository(Meteo::class)->createQueryBuilder('m')
            ->where('m.dateExpiration > :now')
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();

        usort($meteos, fn($a, $b) => $b->getTemperature() <=> $a->getTemperature());
        $plusChaudes = array_slice($meteos, 0, 3);

        usort($meteos, fn($a, $b) => $a->getTemperature() <=> $b->getTemperature());
        $plusFroides = array_slice($meteos, 0, 3);

        usort($meteos, fn($a, $b) => $b->getVent() <=> $a->getVent());
        $plusVenteuses = array_slice($meteos, 0, 3);

        $formatMeteo = fn($m) => [
            'ville' => $m->getVille()->getNom(),
            'pays' => $m->getVille()->getPays(),
            'temperature' => $m->getTemperature(),
            'vent' => $m->getVent(),
        ];

        return $this->json([
            'plus_chaudes' => array_map($formatMeteo, $plusChaudes),
            'plus_froides' => array_map($formatMeteo, $plusFroides),
            'plus_venteuses' => array_map($formatMeteo, $plusVenteuses),
        ]);
    }

    #[Route('/ressenti', name: 'api_classements_ressenti', methods: ['GET'])]
    public function getClassementRessenti(EntityManagerInterface $em): JsonResponse
    {
        $notes = $em->getRepository(Note::class)->findAll();

        $moyennesParVille = [];
        foreach ($notes as $note) {
            $villeId = $note->getVille()->getId();
            if (!isset($moyennesParVille[$villeId])) {
                $moyennesParVille[$villeId] = [
                    'ville' => $note->getVille()->getNom(),
                    'pays' => $note->getVille()->getPays(),
                    'total' => 0,
                    'count' => 0,
                ];
            }
            $moyennesParVille[$villeId]['total'] += $note->getNote();
            $moyennesParVille[$villeId]['count']++;
        }

        foreach ($moyennesParVille as &$moyenne) {
            $moyenne['moyenne'] = round($moyenne['total'] / $moyenne['count'], 1);
            unset($moyenne['total'], $moyenne['count']);
        }

        $moyennesParVille = array_values($moyennesParVille);

        usort($moyennesParVille, fn($a, $b) => $b['moyenne'] <=> $a['moyenne']);
        $meilleurs = array_slice($moyennesParVille, 0, 3);

        usort($moyennesParVille, fn($a, $b) => $a['moyenne'] <=> $b['moyenne']);
        $pires = array_slice($moyennesParVille, 0, 3);

        return $this->json([
            'meilleurs' => $meilleurs,
            'pires' => $pires,
        ]);
    }
}