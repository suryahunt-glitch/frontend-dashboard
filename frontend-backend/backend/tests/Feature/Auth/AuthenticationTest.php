<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertNoContent();
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_authenticate_with_local_demo_password(): void
    {
        config(['app.env' => 'local']);
        config(['auth.local_demo.enabled' => true]);
        config(['auth.local_demo.password' => '12345678']);

        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertNoContent();
    }

    public function test_local_demo_password_is_disabled_outside_local_environment(): void
    {
        config(['app.env' => 'production']);
        config(['auth.local_demo.enabled' => true]);
        config(['auth.local_demo.password' => '12345678']);

        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => '12345678',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertNoContent();
    }
}
