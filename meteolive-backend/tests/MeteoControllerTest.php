<?php

declare(strict_types=1);

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MeteoControllerTest extends WebTestCase
{
    public function testGetMeteoVilleIntrouvable(): void
    {
        $client = static::createClient();

        $client->request(
            'GET',
            '/api/meteo/villequisexistepas123456',
            [],
            [],
            ['HTTP_AUTHORIZATION' => 'Bearer fake_token']
        );

        $this->assertResponseStatusCodeSame(401);
    }

    public function testRegisterSansEmail(): void
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'pseudo' => 'test',
                'password' => 'password123'
            ])
        );

        $this->assertResponseStatusCodeSame(400);
    }

    public function testClassementsMeteoAccessible(): void
    {
        $client = static::createClient();

        $client->request(
            'GET',
            '/api/classements/meteo',
            [],
            [],
            ['HTTP_AUTHORIZATION' => 'Bearer fake_token']
        );

        $this->assertResponseStatusCodeSame(401);
    }
}