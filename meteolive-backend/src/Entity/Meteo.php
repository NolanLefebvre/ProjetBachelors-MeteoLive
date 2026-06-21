<?php

namespace App\Entity;

use App\Repository\MeteoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MeteoRepository::class)]
class Meteo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $temperature = null;

    #[ORM\Column(length: 100)]
    private ?string $conditionMeteo = null;

    #[ORM\Column(length: 255)]
    private ?string $conditionDescription = null;

    #[ORM\Column]
    private ?float $vent = null;

    #[ORM\Column]
    private ?\DateTime $dateMesure = null;

    #[ORM\Column]
    private ?\DateTime $dateMiseAJour = null;

    #[ORM\Column]
    private ?\DateTime $dateExpiration = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ville $ville = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $icone = null;

    #[ORM\Column(nullable: true)]
    private ?int $humidite = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTemperature(): ?float
    {
        return $this->temperature;
    }

    public function setTemperature(float $temperature): static
    {
        $this->temperature = $temperature;

        return $this;
    }

    public function getConditionMeteo(): ?string
    {
        return $this->conditionMeteo;
    }

    public function setConditionMeteo(string $conditionMeteo): static
    {
        $this->conditionMeteo = $conditionMeteo;

        return $this;
    }

    public function getConditionDescription(): ?string
    {
        return $this->conditionDescription;
    }

    public function setConditionDescription(string $conditionDescription): static
    {
        $this->conditionDescription = $conditionDescription;

        return $this;
    }

    public function getVent(): ?float
    {
        return $this->vent;
    }

    public function setVent(float $vent): static
    {
        $this->vent = $vent;

        return $this;
    }

    public function getDateMesure(): ?\DateTime
    {
        return $this->dateMesure;
    }

    public function setDateMesure(\DateTime $dateMesure): static
    {
        $this->dateMesure = $dateMesure;

        return $this;
    }

    public function getDateMiseAJour(): ?\DateTime
    {
        return $this->dateMiseAJour;
    }

    public function setDateMiseAJour(\DateTime $dateMiseAJour): static
    {
        $this->dateMiseAJour = $dateMiseAJour;

        return $this;
    }

    public function getDateExpiration(): ?\DateTime
    {
        return $this->dateExpiration;
    }

    public function setDateExpiration(\DateTime $dateExpiration): static
    {
        $this->dateExpiration = $dateExpiration;

        return $this;
    }

    public function getVille(): ?Ville
    {
        return $this->ville;
    }

    public function setVille(?Ville $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getIcone(): ?string
    {
        return $this->icone;
    }

    public function setIcone(?string $icone): static
    {
        $this->icone = $icone;

        return $this;
    }

    public function getHumidite(): ?int
    {
        return $this->humidite;
    }

    public function setHumidite(?int $humidite): static
    {
        $this->humidite = $humidite;

        return $this;
    }
}
