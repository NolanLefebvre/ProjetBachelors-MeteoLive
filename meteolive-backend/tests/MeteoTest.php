<?php

declare(strict_types=1);

namespace App\Tests;

use PHPUnit\Framework\TestCase;

class MeteoTest extends TestCase
{
    public function testConversionCelsiusVersFahrenheit(): void
    {
        $celsius = 20;
        $fahrenheit = ($celsius * 9 / 5) + 32;

        $this->assertEquals(68, $fahrenheit);
    }

    public function testConversionFahrenheitVersCelsius(): void
    {
        $fahrenheit = 68;
        $celsius = ($fahrenheit - 32) * 5 / 9;

        $this->assertEquals(20, $celsius);
    }

    public function testTemperatureNegative(): void
    {
        $celsius = 0;
        $fahrenheit = ($celsius * 9 / 5) + 32;

        $this->assertEquals(32, $fahrenheit);
    }
}