<?php

namespace Tests\Feature;

use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    public function test_google_redirect_route_exists(): void
    {
        config([
            'services.google.client_id' => 'test-google-client-id',
            'services.google.client_secret' => 'test-google-client-secret',
            'services.google.redirect' => 'http://localhost/auth/google/callback',
        ]);

        $response = $this->get('/auth/google/redirect');

        $response->assertRedirect();
    }
}
