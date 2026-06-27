<?php

namespace App\Controller;

use App\Entity\Meteo;
use App\Entity\Ville;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api')]
class MeteoController extends AbstractController
{
    #[Route('/meteo/{nomVille}', name: 'api_meteo', methods: ['GET'])]
    public function getMeteo(
        string $nomVille,
        EntityManagerInterface $em,
        HttpClientInterface $httpClient,
        Request $request
    ): JsonResponse {


        $ville = $em->getRepository(Ville::class)->findOneBy(['nom' => $nomVille]);

        if ($ville) {
            $meteo = $em->getRepository(Meteo::class)->findOneBy(['ville' => $ville]);

            if ($meteo && $meteo->getDateExpiration() > new \DateTime()) {
                return $this->json([
                    'source' => 'cache',
                    'ville' => $ville->getNom(),
                    'pays' => $ville->getPays(),
                    'temperature' => $meteo->getTemperature(),
                    'condition' => $meteo->getConditionMeteo(),
                    'conditionDescription' => $meteo->getConditionDescription(),
                    'icone' => $meteo->getIcone(),
                    'vent' => $meteo->getVent(),
                    'dateMesure' => $meteo->getDateMesure()->format('Y-m-d H:i:s'),
                    'humidite' => $meteo->getHumidite(),
                ]);
            }
        }

        $apiKey = $_ENV['OPENWEATHER_API_KEY'];
        $response = $httpClient->request('GET', 'https://api.openweathermap.org/data/2.5/weather', [
            'query' => [
                'q' => $nomVille,
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'fr'
            ]
        ]);

        if ($response->getStatusCode() !== 200) {
            return $this->json(['message' => 'Ville introuvable'], 404);
        }
        $data = $response->toArray();
        if (!$ville) {
            $ville = new Ville();
            $ville->setNom($data['name']);
            $ville->setPays($data['sys']['country']);
            $ville->setLatitude($data['coord']['lat']);
            $ville->setLongitude($data['coord']['lon']);
            $em->persist($ville);
        }
        $meteo = $em->getRepository(Meteo::class)->findOneBy(['ville' => $ville]) ?? new Meteo();
        $meteo->setVille($ville);
        $meteo->setTemperature($data['main']['temp']);
        $meteo->setConditionMeteo($data['weather'][0]['main']);
        $meteo->setConditionDescription($data['weather'][0]['description']);
        $meteo->setIcone($data['weather'][0]['icon']);
        $meteo->setVent($data['wind']['speed']);
        $meteo->setDateMesure(new \DateTime());
        $meteo->setDateMiseAJour(new \DateTime());
        $meteo->setDateExpiration((new \DateTime())->modify('+24 hours'));
        $meteo->setHumidite($data['main']['humidity']);

        $em->persist($meteo);
        $em->flush();

        return $this->json([
            'source' => 'api',
            'ville' => $ville->getNom(),
            'pays' => $ville->getPays(),
            'temperature' => $meteo->getTemperature(),
            'condition' => $meteo->getConditionMeteo(),
            'conditionDescription' => $meteo->getConditionDescription(),
            'icone' => $meteo->getIcone(),
            'vent' => $meteo->getVent(),
            'dateMesure' => $meteo->getDateMesure()->format('Y-m-d H:i:s'),
        ]);
    }
    #[Route('/meteo/{nomVille}/previsions', name: 'api_meteo_previsions', methods: ['GET'])]
    public function getPrevisions(
        string $nomVille,
        HttpClientInterface $httpClient
    ): JsonResponse {

    $apiKey = $_ENV['OPENWEATHER_API_KEY'];
    $response = $httpClient->request('GET', 'https://api.openweathermap.org/data/2.5/forecast', [
        'query' => [
            'q' => $nomVille,
            'appid' => $apiKey,
            'units' => 'metric',
            'lang' => 'fr'
        ]
    ]);
    if ($response->getStatusCode() !== 200) {
        return $this->json(['message' => 'Ville introuvable'], 404);
    }

    $data = $response->toArray();

     $heuresFiltre = ['09:00:00', '12:00:00', '15:00:00', '18:00:00', '21:00:00'];
     $date = (new \DateTime())->format('Y-m-d');
     $previsions = [];

    foreach ($data['list'] as $item) {
        $dateItem = $item['dt_txt'];
        $datePartie = substr($dateItem, 0, 10);
        $heurePartie = substr($dateItem, 11);

        if ($datePartie === $date && in_array($heurePartie, $heuresFiltre)) {
            $previsions[] = [
                'heure' => substr($heurePartie, 0, 5), // "09:00"
                'temperature' => $item['main']['temp'],
                'condition' => $item['weather'][0]['main'],
                'conditionDescription' => $item['weather'][0]['description'],
                'icone' => $item['weather'][0]['icon'],
            ];
        }
    }
    return $this->json([
        'ville' => $data['city']['name'],
        'pays' => $data['city']['country'],
        'previsions' => $previsions
    ]);
}
}